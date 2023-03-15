//plugins\electronPlugin.ts
import { ViteDevServer } from 'vite'
import { AddressInfo } from 'net'

export const electronPlugin = () => {
  return {
    name: 'electron-plugin',
    configureServer(server: ViteDevServer) {
      // http 服务启动之前，我们使用 esbuild 模块完成了主进程 TypeScript 代码的编译工作，
      // 这个模块是 Vite 自带的，所以我们不需要额外安装，可以直接使用。
      require('esbuild').buildSync({
        // 主进程的入口文件是通过 entryPoints 配置属性设置的
        entryPoints: ['./src/main/mainEntry.ts'],
        bundle: true,
        // 编译平台 platform 设置为 node
        platform: 'node',
        // 编译完成后的输出文件是通过 outfile 属性配置的。
        outfile: './dist/mainEntry.js',
        // 排除的模块 external 设置为 electron
        external: ['electron']
      })
      // 通过监听 server.httpServer 的 listening 事件来判断 httpServer 是否已经成功启动。
      // 如果已经成功启动了，那么就启动 Electron 应用，并给它传递两个命令行参数，
      // 第一个参数是主进程代码编译后的文件路径，第二个参数是 Vue 页面的 http 地址
      server.httpServer.once('listening', () => {
        const { spawn } = require('child_process')
        const addressInfo = server.httpServer.address() as AddressInfo
        const httpAddress = `http://localhost:${addressInfo.port}`
        console.log(httpAddress)
        const electronProcess = spawn(
          require('electron').toString(),
          ['./dist/mainEntry.js', httpAddress],
          {
            cwd: process.cwd(),
            stdio: 'inherit'
          }
        )
        // 当 electron 子进程退出的时候，我们要关闭 Vite 的 http 服务，并且控制父进程退出，准备下一次启动。
        electronProcess.on('close', () => {
          server.close()
          process.exit()
        })
      })
    }
  }
}
// getReplacer 方法是我们为 vite-plugin-optimizer 插件提供的内置模块列表,
// 用于让 Vite 加载 Electron 的内置模块和 Node.js 的内置模块
export const getReplacer = () => {
  const externalModels = [
    'os',
    'fs',
    'path',
    'events',
    'child_process',
    'crypto',
    'http',
    'buffer',
    'url',
    'better-sqlite3',
    'knex'
  ]
  const result = {}
  for (const item of externalModels) {
    result[item] = () => {
      // 防止有些模块带【-】符号导致语法错误
      const newItem = item.replace('-', '_')
      return {
        find: new RegExp(`^${item}$`),
        code: `const ${newItem} = require('${item}');export { ${newItem} as default }`
      }
    }
  }
  result['electron'] = () => {
    const electronModules = ['clipboard', 'ipcRenderer', 'nativeImage', 'shell', 'webFrame'].join(
      ','
    )
    return {
      find: new RegExp(`^electron$`),
      code: `const {${electronModules}} = require('electron');export {${electronModules}}`
    }
  }
  return result
}
