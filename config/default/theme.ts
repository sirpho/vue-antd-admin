/**
 * @description 导出默认主题配置
 */
import type { themeConfig } from '/@types/config'
import {genFirstColor} from "/config/default/themeColor";

const themeSetting: themeConfig = {
  //布局种类 side/mix/simple
  layout: 'side',
  // 主题 light/dark
  theme: 'dark',
  // 主题色
  primaryColor: genFirstColor(),
  // logo标题
  title: '',
  // 头部菜单高度
  headerHeight: 48,
  // 头部菜单是否固定
  fixedHeader: true,
  // 侧边栏菜单是否固定
  fixSiderbar: true,
  // 菜单是否自动分割
  splitMenus: true,
  //是否显示顶部进度条
  showProgressBar: true,
  //是否显示多标签页
  showTabsBar: true,
  //是否显示全屏组件
  showFullScreen: false,
  //菜单字体链接Url
  iconfontUrl: 'resource/icon/iconPark.js',
  //是否自动隐藏头部
  autoHideHeader: false
}
export default themeSetting
