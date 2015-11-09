export default {
  get: (key) => {
    var value = window.localStorage.getItem(key)
    if (value === undefined) return undefined
    try {
      return JSON.parse(value)
    } catch(e) {
      return undefined
    }
  },

  set: (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}
