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
  title: 'GX Pro Admin',
  //短标题
  shortName: 'gx_pro_admin',
  //标题分隔符
  titleSeparator: ' - ',
  //标题是否反转 如果为false:"page - title"，如果为ture:"title - page"
  titleReverse: false,
  //是否开启水印
  waterMark: true,
  //水印字符
  waterMarkTitle: 'GX Pro Admin',
  //滚动区域选择器
  viewScrollRoot: '#gx-pro-admin>.gx-scrollbar>.gx-scrollbar-wrap',
  //开启cdn
  useCdn: true,
  // proxy target
  proxyTarget: 'http://localhost:9999',
  //开发环境端口号
  devPort: 9999,
  //pro版本copyright可随意修改
  copyright: 'gx12358 2539306317@qq.com',
  //缓存路由的最大数量
  keepAliveMaxNum: 99,
  //路由模式，可选值为 browser 或 hash
  routerMode: 'hash',
  //不经过token校验的路由
  routesWhiteList: [ '/user/login', '/user/register', '/exception/404', '/exception/403' ],
  //加载时显示文字
  loadingText: '正在加载中...',
  //token名称
  tokenName: 'accessToken',
  //token在localStorage、sessionStorage、cookie存储的key的名称
  tokenTableName: 'accessToken',
  //token存储位置localStorage sessionStorage cookie
  storage: 'localStorage',
  //token失效回退到登录页时是否记录本次的路由
  recordRoute: false,
  //是否显示logo，不显示时设置false，显示时请填写remixIcon图标名称，暂时只支持设置remixIcon
  logo: 'vuejs-fill',
  //是否开启登录拦截
  loginInterception: true,
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
