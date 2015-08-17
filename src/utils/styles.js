import stylus from "stylus"
// import PathWatcher from "pathwatcher"
import fs from "fs"
import path from "path"

export default function compileCSS(stylesheet) {
  return new Promise((resolve, reject) => {
    console.time("Compile CSS")
    fs.readFile(stylesheet, {encoding: "utf-8"}, (err, styles) => {
      if (err) return reject(err)
      stylus(styles)
        .set("filename", stylesheet)
        .render((err, css) => {
          if (err) return reject(err)
          let s = document.querySelector("style")
          if (!s) {
            s = document.createElement("style")
            document.querySelector("head").appendChild(s)
          }
          s.innerHTML = css
          console.timeEnd("Compile CSS")
          resolve()
        })
    })
  })
}

// function watchCSS() {
//   PathWatcher.watch(path.resolve(__dirname, "../static/css"), function () {
//     compileCSS();
//   });
// }
//
