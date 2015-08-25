import showdown from "showdown"

var markdownExtensions = function (converter) {
  return [
    {
      type   : "lang",
      filter : (md) => {
        return md.replace(/---[\s\S]*?---/, "")
      }
    }
    // {
    //   type    : "lang",
    //   regex   : ConfigStore.get("mediaRoot"),
    //   replace : "file://" + encodeURI(RepoStore.getMediaPath())
    // }
  ]
}

export default new showdown.Converter({extensions: [markdownExtensions]})
