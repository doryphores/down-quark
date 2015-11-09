export default class GitActions {
  checkoutBranch(branch) {
    this.dispatch(branch)
  }

  createBranch(branchName) {
    this.dispatch(branchName)
  }
}
