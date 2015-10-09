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
    branchNames   : [],
    status        : []
  }

  constructor() {
    this.state = Object.assign({}, GitStore.defaultState)
    this.branches = {}

    const ProjectActions = this.alt.getActions("ProjectActions")
    const GitActions = this.alt.getActions("GitActions")

    this.bindListeners({
      setRoot: ProjectActions.OPEN,
      checkoutBranch: GitActions.CHECKOUT_BRANCH
    })

    this.on("bootstrap", () => {
      _.defaults(this.state, GitStore.defaultState)
      this.setRoot(this.alt.getStore("ProjectStore").getState().rootPath)
    })
  }

  reset() {
    this.setState(GitStore.defaultState)
  }

  setRoot(rootPath) {
    this.preventDefault()
    this.root = rootPath
    this.startPolling()
  }

  checkoutBranch(branchName) {
    if (this.state.currentBranch == branchName) {
      this.preventDefault()
      return
    }

    let branch = this.branches[branchName]

    this.setState({
      working: true
    })
    this.stopPolling()

    NodeGit.Repository.open(this.root).then(repo => {
      if (branch.remote) {
        return repo.getBranchCommit(branch.shorthand)
        .then(commit => {
          return repo.createBranch(
            branchName,
            commit,
            0,
            NodeGit.Signature.default(repo),
            "Created " + branchName
          )
        })
        .then(branchObj => {
          NodeGit.Branch.setUpstream(branchObj, branch.shorthand)
          return repo.checkoutBranch(branchName)
        })
      } else {
        return repo.checkoutBranch(branchName)
      }
    })
    .catch(err => console.log(err.stack))
    .done(this.startPolling.bind(this))
  }

  updateCurrentState() {
    let newState = {
      working: false
    }

    return NodeGit.Repository.open(this.root).then((repo) => {
      newState.enabled = true
      return repo.getCurrentBranch().then((branch) => {
        newState.currentBranch = branch.shorthand()
        return repo.getReferences(NodeGit.Reference.TYPE.OID)
      }).then((refs) => {
        newState.branchNames = []
        let branches = {}

        refs.filter(r => r.isBranch()).forEach(ref => {
          branches[ref.shorthand()] = {
            remote    : false,
            shorthand : ref.shorthand()
          }
        })

        refs.filter(r => !r.isTag() && r.isRemote()).forEach(ref => {
          let branchName = ref.shorthand().replace(/^origin\//, "")
          if (!branches[branchName]) {
            branches[branchName] = {
              remote    : true,
              shorthand : ref.shorthand()
            }
          }
        })

        this.branches = branches
        newState.branchNames = _.keys(branches).sort()
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
