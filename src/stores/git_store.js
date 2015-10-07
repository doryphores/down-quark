import path from "path"
import NodeGit from "nodegit"
import _ from "underscore"

const POLL_INTERVAL = 1000

export default class GitStore {
  static displayName = "GitStore"

  static defaultState = {
    working       : false,
    enabled       : false,
    clean         : true,
    currentBranch : "master",
    branches      : [],
    status        : []
  }

  constructor() {
    this.state = Object.assign({}, GitStore.defaultState)

    const ProjectActions = this.alt.getActions("ProjectActions")
    const GitActions = this.alt.getActions("GitActions")

    this.bindListeners({
      setRoot: ProjectActions.OPEN,
      checkoutBranch: GitActions.CHECKOUT_BRANCH
    })

    this.on("bootstrap", () => {
      this.state = Object.assign({}, GitStore.defaultState, this.state)
      this.setRoot(this.alt.getStore("ProjectStore").getState().rootPath)
    })
  }

  reset() {
    this.setState(GitStore.defaultState)
  }

  setRoot(rootPath) {
    this.root = rootPath
    this.updateCurrentState()
    this.startPolling()
    this.preventDefault()
  }

  checkoutBranch(branch) {
    this.setState({
      working: true
    })
    this.stopPolling()
    NodeGit.Repository.open(this.root).then(repo => {
      if (branch.remote) {
        return repo.getBranchCommit("origin/" + branch.name)
        .then(commit => {
          return repo.createBranch(
            branch.name,
            commit,
            0,
            NodeGit.Signature.default(repo),
            "Created " + branch.name
          )
        })
        .then(branchObj => {
          NodeGit.Branch.setUpstream(branchObj, "origin/" + branch.name)
          return repo.checkoutBranch(branch.name)
        })
      } else {
        return repo.checkoutBranch(branch.name)
      }
    })
    .catch(err => console.log(err.stack))
    .done(() => {
      this.startPolling()
    })
  }

  updateCurrentState() {
    let newState = {
      working: false
    }

    return NodeGit.Repository.open(this.root).then((repo) => {
      newState.enabled = true
      repo.getCurrentBranch().then((branch) => {
        newState.currentBranch = branch.shorthand()
        return repo.getReferences(NodeGit.Reference.TYPE.OID)
      }).then((refs) => {
        newState.branches = []
        let branches = refs.filter(r => r.isBranch()).map(r => {
          return {
            remote : false,
            name   : r.shorthand()
          }
        })
        refs.filter(r => !r.isTag() && r.isRemote()).forEach(r => {
          let name = r.shorthand().replace(/^origin\//, "")
          if (!_.some(branches, b => b.name == name)) {
            branches.push({
              remote : true,
              name   : name
            })
          }
        })
        newState.branches = branches.sort((a, b) => a.name.localeCompare(b.name))
        return repo.getStatus()
      }).then((status) => {
        newState.status = status.map((s) => {
          return {
            path   : s.path(),
            status : s.status()[0].toLowerCase().replace(/^WT_/, "")
          }
        })
      })
      .then(() => this.setState(newState))
      .catch(err => console.log(err))
    }, (err) => {
      this.reset()
      this.stopPolling()
    })
  }

  startPolling() {
    this.stopPolling()
    this.updateCurrentState().then(() => {
      this.pollTimer = setTimeout(this.startPolling.bind(this), POLL_INTERVAL)
    })
  }

  stopPolling() {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer)
    }
  }
}
