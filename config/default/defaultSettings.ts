/**
 * @description 导出默认通用配置
 */
import type { settingConfig } from '/types/config'

const defaultSettings: settingConfig = {
  //开发以及部署时的URL，hash模式时在不确定二级目录名称的情况下建议使用""代表相对路径或者"/二级目录/"，history模式默认使用"/"或者"/二级目录/"
  publicPath: './',
  //生产环境构建文件的目录名
  outputDir: 'dist',
  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'assets',
  //标题 （包括初次加载雪花屏的标题 页面的标题 浏览器的标题）
  title: '资金链系统',
  //短标题
  shortName: 'ecm',
  //标题分隔符
  titleSeparator: ' - ',
  //标题是否反转 如果为false:"page - title"，如果为ture:"title - page"
  titleReverse: false,
  //是否开启水印
  waterMark: true,
  //水印字符
  waterMarkTitle: 'sirpho',
  //滚动区域选择器
  viewScrollRoot: '#gx-pro-admin>.gx-scrollbar>.gx-scrollbar-wrap',
  //开启proxy
  useProxy: false,
  // proxy target
  proxyTarget: 'http://127.0.0.1:3000',
  // 接口前缀
  requestPrefix: '',
  //开发环境端口号
  devPort: 8080,
  //pro版本copyright可随意修改
  copyright: 'sirpho',
  // 是否启用路由缓存
  keepAlive: false,
  //缓存路由的最大数量
  keepAliveMaxNum: 99,
  //初次页面加载时间
  routerLoadTime: 200,
  //路由模式，可选值为 browser 或 hash
  routerMode: 'hash',
  //不经过token校验的路由
  routesWhiteList: [ '/user/login', '/exception/404', '/exception/403' ],
  //token名称
  tokenName: 'token',
  //token在localStorage、sessionStorage、cookie存储的key的名称
  tokenTableName: 'accessToken',
  //token存储位置localStorage sessionStorage cookie
  storage: 'localStorage',
  //token失效回退到登录页时是否记录本次的路由
  recordRoute: false,
  //是否开启登录RSA加密
  loginRSA: false,
  //intelligence（前端导出路由）和all（后端导出路由）两种方式
  authentication: 'all',
  //是否开启roles字段进行角色权限控制（如果是all模式后端完全处理角色并进行json组装，可设置false不处理路由中的roles字段）
  rolesControl: true,
  //vertical gallery comprehensive common布局时是否只保持一个子菜单的展开
  uniqueOpened: false,
  //vertical布局时默认展开的菜单path，使用逗号隔开建议只展开一个
  defaultOpeneds: [ '' ],
  //需要加loading层的请求，防止重复提交
  debounce: [ 'doEdit' ]
}

export default defaultSettings
