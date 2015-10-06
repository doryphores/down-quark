import path from "path"
import NodeGit from "nodegit"

const POLL_INTERVAL = 1000

export default class GitStore {
  static displayName = "GitStore"

  constructor() {
    this.state = {
      currentBranch : "master",
      status        : []
    }

    const ProjectActions = this.alt.getActions("ProjectActions")

    this.bindListeners({
      setRoot: ProjectActions.OPEN
    })

    this.on("bootstrap", () => {
      this.setRoot(this.alt.getStore("ProjectStore").getState().rootPath)
    })
  }

  setRoot(rootPath) {
    this.root = rootPath
    this.updateCurrentState()
    this.pollForChanges()
    this.preventDefault()
  }

  updateCurrentState() {
    let newState = {}

    NodeGit.Repository.open(this.root)
    .then(repo => repo.getCurrentBranch())
    .then((branch) => {
      newState.currentBranch = branch.shorthand()
      return repo.getStatus()
    })
    .then((status) => {
        newState.status = status.map((s) => {
          return {
            path   : s.path(),
            status : s.status()[0]
          }
        })
      })
    })
    .catch(err => console.log(err))
    .done(() => this.setState(newState))
  }

  pollForChanges() {
    if (this.poll) {
      clearInterval(this.poll)
    }
    this.poll = setInterval(() => {
      this.updateCurrentState()
    }, POLL_INTERVAL)
  }
}
