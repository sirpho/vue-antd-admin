import path from 'path'
import fs from 'fs'

class BuildObj {
  // 由于 Vite 在编译之前会清空 dist 目录，
  // 所以我们生成的 mainEntry.js 文件也被删除了，
  // 此处我们通过buildMain方法再次编译主进程的代码。
  // 不过由于此处是在为生产环境编译代码，
  // 所以我们增加了minify: true 配置，生成压缩后的代码。
  // 如果你希望与开发环境复用编译主进程的代码，也可以把这部分代码抽象成一个独立的方法。
  buildMain() {
    require('esbuild').buildSync({
      entryPoints: ['./src/main/mainEntry.ts'],
      bundle: true,
      platform: 'node',
      minify: true,
      outfile: './dist/mainEntry.js',
      external: ['electron']
    })
  }

  // 用户安装我们的产品后，在启动我们的应用程序时，
  // 实际上是通过 Electron 启动一个 Node.js 的项目，
  // 所以我们要为这个项目准备一个 package.json 文件，
  // 这个文件是以当前项目的 package.json 文件为蓝本制作而成的。
  // 里面注明了主进程的入口文件，移除了一些对最终用户没用的配置节
  preparePackageJson() {
    const pkgJsonPath = path.join(process.cwd(), 'package.json')
    const localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
    //https://github.com/electron-userland/electron-builder/issues/4157#issuecomment-596419610
    // 这段脚本还明确指定了 Electron 的版本号，如果 Electron 的版本号前面有"^"符号的话，需把它删掉。
    // 这是 electron-builder 的一个 Bug，这个 bug 导致 electron-builder 无法识别带 ^ 或 ~ 符号的版本号。
    const electronConfig = localPkgJson.devDependencies.electron.replace('^', '')
    localPkgJson.main = 'mainEntry.js'
    delete localPkgJson.scripts
    delete localPkgJson.devDependencies
    localPkgJson.devDependencies = { electron: electronConfig }
    const tarJsonPath = path.join(process.cwd(), 'dist', 'package.json')
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson))
    // 生成完 package.json 文件之后，还创建了一个 node_modules 目录。
    // 此举是为了阻止 electron-builder 的一些默认行为（目前来说它会阻止electron-builder为我们创建一些没用的目录或文件）。
    fs.mkdirSync(path.join(process.cwd(), 'dist/node_modules'))
  }

  buildInstaller() {
    const options = {
      config: {
        directories: {
          output: path.join(process.cwd(), 'release'),
          app: path.join(process.cwd(), 'dist')
        },
        files: ['**'],
        extends: null,
        productName: 'sirpho',
        appId: 'com.sirpho.desktop',
        asar: true,
        nsis: {
          oneClick: true,
          perMachine: true,
          allowToChangeInstallationDirectory: false,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: 'sirphoDesktop'
        },
        publish: [{ provider: 'generic', url: 'http://localhost:10086/' }]
      },
      project: process.cwd()
    }
    return require('electron-builder').build(options)
  }
}

export const buildPlugin = () => {
  return {
    name: 'build-plugin',
    closeBundle: () => {
      const buildObj = new BuildObj()
      buildObj.buildMain()
      buildObj.preparePackageJson()
      buildObj.buildInstaller()
    }
  }
}
