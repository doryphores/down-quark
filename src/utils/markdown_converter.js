import showdown from "showdown"

module.exports = {
  getShowdownConverter: (mediaPath) => {
    return new showdown.Converter({
      extensions: [
        (converter) => [
          {
            type   : "lang",
            filter : md => md.replace(/(^|---)[\s\S]*?---/, "")
          },
          {
            type    : "lang",
            regex   : /(!\[.*?\]\()((?!http)\/?)/g,
            replace : `$1file://${encodeURI(mediaPath)}/`
          }
        ]
      ]
    })
  }
}
