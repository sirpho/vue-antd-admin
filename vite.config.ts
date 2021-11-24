import type { UserConfig, ConfigEnv } from 'vite'

import { loadEnv } from 'vite'
import { resolve } from 'path'

import externalGlobals from 'rollup-plugin-external-globals'
import { generateModifyVars } from './build/generate/generateModifyVars'
import { wrapperEnv } from './build/utils'
import { createVitePlugins } from './build/vite/plugin'
import config, { createProxy } from './config/config'

import pkg from './package.json'
import moment from 'moment'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

const { publicPath, outputDir, assetsDir, devPort } = config.defaultSettings

const { dependencies, devDependencies, name, version } = pkg

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: moment().format('YYYY-MM-DD HH:mm:ss')
}

process.env.VUE_APP_VERSION = version

export default ({ command, mode }: ConfigEnv): UserConfig => {

  const root = process.cwd()

  const env = loadEnv(mode, root)

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env)

  const { VITE_DROP_CONSOLE, VITE_APP_ENV, VITE_BASE_URL } = viteEnv

  const isBuild = command === 'build'

  return {
    base: publicPath,
    root,
    resolve: {
      alias: [
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/'
        },
        {
          find: /\/types\//,
          replacement: pathResolve('types') + '/'
        },
        {
          find: /\/config\//,
          replacement: pathResolve('config') + '/'
        },
        {
          find: /\/build\//,
          replacement: pathResolve('build') + '/'
        },
        {
          find: '@wd-pro/pro-layout',
          replacement: pathResolve('src/components/WProLayout') + '/'
        },
        {
          find: '@wd-pro/pro-table',
          replacement: pathResolve('src/components/WProTable') + '/'
        },
        {
          find: '@wd-pro/pro-card',
          replacement: pathResolve('src/components/WProCard') + '/'
        },
        {
          find: '@wd/pro-upload',
          replacement: pathResolve('src/components/WUpload') + '/'
        },
        {
          find: '@wd-design/pro-field',
          replacement: pathResolve('src/components/WProField') + '/index.tsx'
        },
        {
          find: '@wd-design/pro-utils',
          replacement: pathResolve('src/components/_util') + '/'
        },
        { find: /^~/, replacement: '' }
      ]
    },
    server: {
      open: true,
      host: true,
      port: devPort,
      proxy: createProxy(VITE_BASE_URL)[VITE_APP_ENV]
    },
    build: {
      target: 'es2015',
      outDir: outputDir,
      assetsDir,
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE
        }
      },
      brotliSize: false,
      chunkSizeWarningLimit: 2500,
      rollupOptions: {
        external: [ 'vue', 'moment', 'vuex', 'vue-router', 'echarts' ],
        plugins: [
          externalGlobals({
            vue: 'Vue',
            vuex: 'Vuex',
            'vue-router': 'VueRouter',
            moment: 'moment',
            echarts: 'echarts'
          })
        ]
      }
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
      preprocessorOptions: {
        css: {
          modules: {
            localIdentName: 'wd-pro-[path][local]'
          }
        },
        less: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true
        }
      }
    },

    plugins: createVitePlugins(viteEnv, isBuild),

    optimizeDeps: {
      include: [
        'ant-design-vue/es/locale/zh_CN',
        'moment/dist/locale/zh-cn',
        'ant-design-vue/es/locale/en_US',
        'moment/dist/locale/eu'
      ],
      exclude: [ 'vue-demi' ]
    }
  }
};
