import showdown from "showdown"

var markdownExtensions = function (converter) {
  return [
    {
      type   : "lang",
      filter : (md) => {
        return md.replace(/---[\s\S]*?---/, "")
      }
    }
  ]
}

export default new showdown.Converter({extensions: [markdownExtensions]})
