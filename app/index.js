var app = require("app");  // Module to control application life.
var BrowserWindow = require("browser-window");  // Module to create native browser window.

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Prevent multiple instances of Down Quark
if (app.makeSingleInstance(function (commandLine, workingDirectory) {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
  return true;
})) {
  app.quit();
  return;
}

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on("ready", function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    "auto-hide-menu-bar": true,
    icon: __dirname + "/static/images/icon.png"
  });

  // and load the index.html of the app.
  mainWindow.loadUrl("file://" + __dirname + "/index.html");

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
