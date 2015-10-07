import path from "path"
import NodeGit from "nodegit"
import _ from "underscore"

const POLL_INTERVAL = 1000

export default class GitStore {
  static displayName = "GitStore"

  static defaultState = {
    enabled       : false,
    clean         : true,
    currentBranch : "master",
    branches      : [],
    status        : []
  }

  constructor() {
    this.state = Object.assign({}, GitStore.defaultState)

    const ProjectActions = this.alt.getActions("ProjectActions")

    this.bindListeners({
      setRoot: ProjectActions.OPEN
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
    this.pollForChanges()
    this.preventDefault()
  }

  updateCurrentState() {
    let newState = {}

    NodeGit.Repository.open(this.root).then((repo) => {
      newState.enabled = true
      repo.getCurrentBranch().then((branch) => {
        newState.currentBranch = branch.shorthand()
        return repo.getReferences(NodeGit.Reference.TYPE.LISTALL)
      }).then((refs) => {
        newState.branches = refs.filter(r => !r.isTag()).map((r) => {
          return r.shorthand()
        }).sort()
        return repo.getStatus()
      }).then((status) => {
        newState.status = status.map((s) => {
          return {
            path   : s.path(),
            status : s.status()[0].toLowerCase().replace(/^WT_/, "")
          }
        })
      })
      .catch(err => console.log(err))
      .done(() => this.setState(newState))
    }, (err) => {
      this.reset()
      this.stopPolling()
    })
  }

  pollForChanges() {
    this.stopPolling()
    this.poll = setInterval(() => {
      this.updateCurrentState()
    }, POLL_INTERVAL)
  }

  stopPolling() {
    if (this.poll) {
      clearInterval(this.poll)
    }
  }
}
