/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
import defaultSettings from './defaultSettings'

const { devPort } = defaultSettings

export default {
  dev: {
    '/mock-server': {
      target: `http://localhost:${devPort}`,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/basic-api/, '')
    }
  },
  test: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
