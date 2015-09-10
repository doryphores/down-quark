import Dialogs from "../utils/dialogs"

export default class TabActions {
  new() {
    this.dispatch()
  }

  select(index) {
    this.dispatch(index)
  }

  close(index) {
    let buffer = this.alt.getStore("BufferStore").getBuffer(index)

    if (!buffer) return

    if (buffer.clean) {
      this.dispatch(index)
    } else {
      Dialogs.confirmClose(buffer.name).then((save) => {
        if (save) {
          this.alt.getActions("BufferActions").save(index, true)
        } else {
          this.dispatch(index)
        }
      })
    }
  }

  closeAll() {
    this.dispatch()
  }
}
