/**
 * @author gx12358 2539306317@qq.com
 * @description 所有全局配置的状态管理，如无必要请勿修改
 */
import config from '/config/config'
import { isJson } from '/@/utils/validate'

const { logo, title } = config.defaultSettings

const {
  layout,
  theme,
  animate,
  fixedHeader,
  fixSiderbar,
  autoHideHeader,
  showTabsBar,
  showProgressBar
} = config.theme

const getLocalStorage = (key) => {
  const value: any = localStorage.getItem(key)
  if (isJson(value)) {
    return JSON.parse(value)
  } else {
    return false
  }
}
const { collapse } = getLocalStorage('wd-pro-admin-collapse')
const state = () => ({
  logo,
  title,
  collapse,
  theme: theme,
  layout: layout,
  animate: animate || {
    name: 'fade',
    direction: 'default'
  },
  autoHideHeader: autoHideHeader,
  showTabsBar: showTabsBar,
  fixedHeader: layout === 'mix' ? true : fixedHeader,
  fixSiderbar: layout === 'mix' ? true : fixSiderbar,
  keepAlive: false,
  device: 'desktop',
  sidebar: !collapse,
  showProgressBar: showProgressBar
})
const getters = {
  collapse: (state) => state.collapse,
  device: (state) => state.device,
  language: (state) => state.language,
  layout: (state) => state.layout,
  logo: (state) => state.logo,
  title: (state) => state.title,
  showProgressBar: (state) => state.showProgressBar,
  theme: (state) => state.theme,
  fixedHeader: (state) => state.fixedHeader,
  fixSiderbar: (state) => state.fixSiderbar,
  autoHideHeader: (state) => state.autoHideHeader,
  showTabsBar: (state) => state.showTabsBar,
  sidebarOpened: (state) => state.sidebar,
  animate: (state) => state.animate,
  keepAlive: (state) => state.keepAlive
}
const mutations = {
  setSidebar: (state, type) => {
    state.sidebar = type
  },
  toggleCollapse(state) {
    state.collapse = !state.collapse
    state.sidebar = !state.collapse
    localStorage.setItem(
      'wd-pro-admin-collapse',
      `{"collapse":${state.collapse}}`
    )
  },
  toggleDevice(state, device) {
    state.device = device
  },
  changeLayout(state, layout) {
    state.layout = layout
  },
  handleShowProgressBar(state, showProgressBar) {
    state.showProgressBar = showProgressBar
  },
  openSideBar(state) {
    state.collapse = false
  },
  foldSideBar(state) {
    state.collapse = true
  },
  changeLanguage(state, language) {
    localStorage.setItem('wd-pro-admin-language', `{"language":"${language}"}`)
    state.language = language
  }
}
const actions = {
  setSidebar({ commit }, type) {
    commit('setSidebar', type)
  },
  toggleCollapse({ commit }) {
    commit('toggleCollapse')
  },
  toggleDevice({ commit }, device) {
    commit('toggleDevice', device)
  },
  changeLayout({ commit }, layout) {
    commit('changeLayout', layout)
  },
  handleShowProgressBar: ({ commit }, showProgressBar) => {
    commit('handleShowProgressBar', showProgressBar)
  },
  openSideBar({ commit }) {
    commit('openSideBar')
  },
  foldSideBar({ commit }) {
    commit('foldSideBar')
  },
  changeLanguage: ({ commit }, language) => {
    commit('changeLanguage', language)
  }
}
export default { state, getters, mutations, actions }
