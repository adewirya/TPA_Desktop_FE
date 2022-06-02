const { app, BrowserWindow, Tray, Menu } = require("electron")

var window = null

app.whenReady().then(() => {

    window = new BrowserWindow({
        width: 1100,
        height: 900,
        darkTheme: true,
        // fullscreen: true 
        // maximizable: true   
    })

    window.maximize()

    var OnClick = ()=>{
        window.isVisible() ? window.hide() : window.show()
    }

    var windowExit = () =>{
        window.close()
    }
    const menu = Menu.buildFromTemplate([
        {    
            label: "Hide", click: OnClick
        },
        {
            label: "Exit", click: windowExit
        }
    ]) 

    window.setIcon('Assets/Discord-Logo-Color.png')

    window.loadFile('html/login.html')
    tray = new Tray('Assets/Discord-Logo-Color.png')
    tray.setToolTip("PHiscord")

    tray.setContextMenu(menu)
    
    window.setThumbarButtons([
        {
            tooltip: 'mute',
            icon: 'Assets/microphone.png',
            click () { console.log('thumbar button clicked') }
        },
        {
            tooltip: 'exit',
            icon: ' Asset/exit.png',
            click () { app.quit() }
        }
    ])


})

app.setUserTasks([
    {
        title: "Mute",
        description: "",
        arguments: "",
        iconIndex: 0,
        iconPath: "",
        program: ""
    },
    {
        title: "Deafen",
        description: "",
        arguments: "",
        iconIndex: 0,
        iconPath: "",
        program: ""
    },
    {
        title: "Disconnect",
        description: "",
        arguments: "",
        iconIndex: 0,
        iconPath: "",
        program: ""
    },
]);

