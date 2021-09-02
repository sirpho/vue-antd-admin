import type { UserConfig, ConfigEnv } from 'vite'

import { loadEnv } from 'vite'
import { resolve } from 'path'

import externalGlobals from 'rollup-plugin-external-globals'
import { generateModifyVars } from './build/generate/generateModifyVars'
import { wrapperEnv } from './build/utils'
import { createVitePlugins } from './build/vite/plugin'
import config from './config/config'
import proxy from './config/default/proxy'

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

  const { VITE_DROP_CONSOLE, VITE_APP_ENV } = viteEnv

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
          find: '@wd-pro/pro-layout',
          replacement: pathResolve('src/components/WProLayout') + '/'
        },
        { find: /^~/, replacement: '' }
      ]
    },
    server: {
      open: true,
      host: true,
      port: devPort,
      proxy: proxy[VITE_APP_ENV] || {}
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
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        external: [ 'vue', 'moment', 'vuex', 'vue-router' ],
        plugins: [
          externalGlobals({
            vue: 'Vue',
            vuex: 'Vuex',
            'vue-router': 'VueRouter',
            // lodash: '_',
            moment: 'moment'
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

    // The vite plugin used by the project. The quantity is large, so it is separately extracted and managed
    plugins: createVitePlugins(viteEnv, isBuild),

    optimizeDeps: {
      // @iconify/iconify: The dependency is dynamically and virtually loaded by @purge-icons/generated, so it needs to be specified explicitly
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
