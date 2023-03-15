//src\main\mainEntry.ts
import { app, BrowserWindow } from 'electron'
import { CustomScheme } from './CustomScheme'
// 用于设置渲染进程开发者调试工具的警告，这里设置为 true 就不会再显示任何警告了。
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
let mainWindow: BrowserWindow

app.whenReady().then(() => {
  const config = {
    webPreferences: {
      // 该配置项的作用是把 Node.js 环境集成到渲染进程中
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      // 在同一个 JavaScript 上下文中使用 Electron API
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true
    }
  }
  mainWindow = new BrowserWindow(config)
  // 打开开发者调试工具
  mainWindow.webContents.openDevTools({ mode: 'undocked' })
  if (process.argv[2]) {
    mainWindow.loadURL(process.argv[2])
  } else {
    CustomScheme.registerScheme()
    mainWindow.loadURL(`app://index.html`)
  }
})
