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

    if (!buffer) {
      return Promise.reject("Attempting to close a buffer that does not exist")
    }

    return new Promise((resolve, reject) => {
      if (buffer.clean) {
        this.dispatch(index)
        resolve()
      } else {
        Dialogs.confirmClose(buffer.name).then((save) => {
          if (save) {
            this.alt.getActions("BufferActions").save(index).then(() => {
              this.dispatch(index)
              resolve()
            }).catch(reject)
          } else {
            this.dispatch(index)
            resolve()
          }
        })
      }
    })
  }

  closeAll() {
    return new Promise((resolve, reject) => {
      if (this.alt.getStore("BufferStore").getState().buffers.length) {
        this.alt.getActions("TabActions").close().then(() => {
          this.alt.getActions("TabActions").closeAll().then(() => {
            resolve()
          })
        })
      } else {
        resolve()
      }
    })
  }
}
