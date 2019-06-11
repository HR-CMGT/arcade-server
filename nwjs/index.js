// OPEN TERMINAL IN TEST2 FOLDER, OPEN APP MET:
// nwjs.app/Contents/MacOS/nwjs .

// VARIABLE HOLDS NW WINDOW REFERENCE
let NWWindow
let baseURL = "https://hr-cmgt.github.io/arcade-server/"

// CREATE SHORTCUT
let option = {
    key: "Ctrl+A",
    active: function () {
        // console.log("Global desktop keyboard shortcut: " + this.key + " active.");
        if (NWWindow != undefined && NWWindow != null) {
            NWWindow.window.location.href = baseURL
        }
    },
    failed: function (msg) {
        // console.log(msg)
    }
};

var shortcut = new nw.Shortcut(option)
nw.App.registerGlobalHotKey(shortcut)

// note: you have to close / restart the whole nw thing instead of reloading

// allowed shortcut key combinations
// http://docs.nwjs.io/en/latest/References/Shortcut/#shortcutkey

// OPEN THE NW WINDOW PROGRAMMATICALLY

openWindow()

function openWindow() {
    let options = {
        fullscreen: true,
        kiosk: true,
        position: null,
        resizable: false,
        show: true
    }

    // menu : false
    
    nw.Window.open(baseURL, options, (win) => {   
        NWWindow = win

        // only in sdk version // you have to also open background script console to see these logs!
        // win.showDevTools() 
        // win is een NWWindow that contains the new DOM context window!
        // let domwindow = NWWindow.window
        // console.log(domwindow)
    })
}
