var settings = {}
var storage = window.localStorage

for (let i = 0, k = storage.key(i); i < storage.length; i++) {
  settings[k] = JSON.parse(storage.getItem(k))
}

module.exports = {
  get: (key) => {
    return settings[key]
  },

  set: (key, value) => {
    settings[key] = value
    storage.setItem(key, JSON.stringify(value))
  }
}
