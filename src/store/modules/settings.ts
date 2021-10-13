/**
 * @author gx12358 2539306317@qq.com
 * @description 所有全局配置的状态管理，如无必要请勿修改
 */
import config from '/config/config'

const { logo, title } = config.defaultSettings

const {
  layout,
  theme,
  primaryColor,
  animate,
  fixedMultiTab,
  fixedHeader,
  fixSiderbar,
  autoHideHeader,
  showTabsBar,
  showProgressBar
} = config.theme

const state = () => ({
  logo,
  title,
  collapse: false,
  theme,
  primaryColor,
  layout,
  animate: animate || {
    name: 'fade',
    direction: 'default'
  },
  autoHideHeader,
  showTabsBar,
  fixedMultiTab,
  fixedHeader: layout === 'mix' ? true : fixedHeader,
  fixSiderbar: layout === 'mix' ? true : fixSiderbar,
  keepAlive: false,
  showProgressBar
})
const getters = {
  collapse: (state) => state.collapse,
  layout: (state) => state.layout,
  logo: (state) => state.logo,
  title: (state) => state.title,
  showProgressBar: (state) => state.showProgressBar,
  theme: (state) => state.theme,
  primaryColor: (state) => state.primaryColor,
  fixedMultiTab: (state) => state.fixedMultiTab,
  fixedHeader: (state) => state.fixedHeader,
  fixSiderbar: (state) => state.fixSiderbar,
  autoHideHeader: (state) => state.autoHideHeader,
  showTabsBar: (state) => state.showTabsBar,
  animate: (state) => state.animate,
  keepAlive: (state) => state.keepAlive
}
const mutations = {
  toggleCollapse(state) {
    state.collapse = !state.collapse
  },
  changeLayout(state, layout) {
    state.layout = layout
  },
  changeTheme(state, theme) {
    state.theme = theme
  },
  changePrimaryColor(state, primaryColor) {
    state.primaryColor = primaryColor
  },
  changeFixedHeader(state, type) {
    state.fixedHeader = type
  },
  changeFixSiderbar(state, type) {
    state.fixSiderbar = type
  },
  handleShowTabsBar(state, type) {
    state.showTabsBar = type
  },
  changeFixedMultiTab(state, type) {
    state.fixedMultiTab = type
  },
  handleShowProgressBar(state, type) {
    state.showProgressBar = type
  },
  handleShowAnimate(state, type) {
    state.animate.disabled = type
  },
  changeAnimateMode(state, mode) {
    state.animate.name = mode
  },
  changeAnimateDirections(state, direction) {
    state.animate.direction = direction
  },
  openSideBar(state) {
    state.collapse = false
  },
  foldSideBar(state) {
    state.collapse = true
  }
}
const actions = {
  changeTheme({ commit }, theme) {
    commit('changeTheme', theme)
  },
  changePrimaryColor({ commit }, primaryColor) {
    commit('changePrimaryColor', primaryColor)
  },
  changeLayout({ commit }, layout) {
    commit('changeLayout', layout)
  },
  changeFixedHeader({ commit }, type) {
    commit('changeFixedHeader', type)
  },
  changeFixSiderbar({ commit }, type) {
    commit('changeFixSiderbar', type)
  },
  handleShowTabsBar({ commit }, type) {
    commit('handleShowTabsBar', type)
  },
  changeFixedMultiTab({ commit }, type) {
    commit('changeFixedMultiTab', type)
  },
  handleShowProgressBar: ({ commit }, type) => {
    commit('handleShowProgressBar', type)
  },
  handleShowAnimate: ({ commit }, type) => {
    commit('handleShowAnimate', type)
  },
  changeAnimateMode: ({ commit }, mode) => {
    commit('changeAnimateMode', mode)
  },
  changeAnimateDirections: ({ commit }, directions) => {
    commit('changeAnimateDirections', directions)
  },
  toggleCollapse({ commit }) {
    commit('toggleCollapse')
  },
  openSideBar({ commit }) {
    commit('openSideBar')
  },
  foldSideBar({ commit }) {
    commit('foldSideBar')
  }
}
export default { state, getters, mutations, actions }
