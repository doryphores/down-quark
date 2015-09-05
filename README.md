# Down Quark

**Down Quark** is a cross-platform markdown editor built on top of
[Electron](http://electron.atom.io/).

Tech stack:
- JavaScript ES6/ES7 (using [Babel](http://babeljs.io) as a transpiler)
- [Electron](http://electron.atom.io/)
- [React](http://facebook.github.io/react/) with [Alt](http://alt.js.org/)
- [CodeMirror](http://codemirror.net)

![Screenshot - Editing Electron docs folder](docs/screenshot.png)

## Install and run in development mode

To install node dependencies and rebuild native modules for the electron
runtime:

```
npm run install-deps
```

To start **Down Quark**:

```
npm start
```

To watch for JS and CSS changes:

```
npm run watch
```

## Build for your platform

```
npm run package
```

This will package **Down Quark** for your platform and architecture.

Requirements for building on Windows:
- [Python 2.7](https://www.python.org/downloads/)
- [Visual Studio Express 2013](http://www.microsoft.com/en-gb/download/details.aspx?id=44914)

## Down Quark?

Down Quark is a mark**down** editor built on Electron. The electron is an elementary particle of the standard model, as a **quarks**. [Quarks](https://en.wikipedia.org/wiki/Quark) come in 6 flavours: up, **down**, strange, charm, top and bottom.