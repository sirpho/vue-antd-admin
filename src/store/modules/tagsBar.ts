/**
 * @author gx12358 2539306317@qq.com
 * @description tagsBar多标签页逻辑，前期借鉴了很多开源项目发现都有个共同的特点很繁琐并不符合框架设计的初衷，后来在github用户cyea的启发下完成了重构，请勿修改
 */
const state = () => ({
  visitedRoutes: []
})
const getters = {
  visitedRoutes: (state) => state.visitedRoutes
}
const mutations = {
  /**
   * @author gx12358 2539306317@qq.com
   * @description 添加标签页
   * @param {*} state
   * @param {*} route
   * @returns
   */
  addVisitedRoute(state, route) {
    const target = state.visitedRoutes.find((item) => item.path === route.path)
    if (target) {
      if (route.fullPath !== target.fullPath) Object.assign(target, route)
      return
    }
    if (route.tagFixed) {
      state.visitedRoutes.unshift(Object.assign({}, route))
    } else {
      state.visitedRoutes.push(Object.assign({}, route))
    }
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 删除当前标签页
   * @param {*} state
   * @param {*} route
   * @returns
   */
  delVisitedRoute(state, route) {
    state.visitedRoutes.forEach((item, index) => {
      if (item.path === route.path) state.visitedRoutes.splice(index, 1)
    })
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 删除当前标签页以外其它全部多标签页
   * @param {*} state
   * @param {*} route
   * @returns
   */
  delOthersVisitedRoutes(state, route) {
    state.visitedRoutes = state.visitedRoutes.filter(
      (item) => item.meta.tagFixed || item.path === route.path
    )
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 删除当前标签页左边全部多标签页
   * @param {*} state
   * @param {*} route
   * @returns
   */
  delLeftVisitedRoutes(state, route) {
    let index = state.visitedRoutes.length
    state.visitedRoutes = state.visitedRoutes.filter((item) => {
      if (item.name === route.name) index = state.visitedRoutes.indexOf(item)
      return item.meta.tagFixed || index <= state.visitedRoutes.indexOf(item)
    })
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 删除当前标签页右边全部多标签页
   * @param {*} state
   * @param {*} route
   * @returns
   */
  delRightVisitedRoutes(state, route) {
    let index = state.visitedRoutes.length
    state.visitedRoutes = state.visitedRoutes.filter((item) => {
      if (item.name === route.name) index = state.visitedRoutes.indexOf(item)
      return item.meta.tagFixed || index >= state.visitedRoutes.indexOf(item)
    })
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 删除全部多标签页
   * @param {*} state
   * @param {*} route
   * @returns
   */
  delAllVisitedRoutes(state) {
    state.visitedRoutes = state.visitedRoutes.filter((item) => item.meta.tagFixed)
  }
}
const actions = {
  /**
   * @author gx12358 2539306317@qq.com
   * @description 添加标签页
   * @param {*} { commit }
   * @param {*} route
   */
  addVisitedRoute({ commit }, route) {
    commit('addVisitedRoute', route)
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 删除当前标签页
   * @param {*} { commit }
   * @param {*} route
   */
  delVisitedRoute({ commit }, route) {
    commit('delVisitedRoute', route)
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 删除当前标签页以外其它全部多标签页
   * @param {*} { commit }
   * @param {*} route
   */
  delOthersVisitedRoutes({ commit }, route) {
    commit('delOthersVisitedRoutes', route)
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 删除当前标签页左边全部多标签页
   * @param {*} { commit }
   * @param {*} route
   */
  delLeftVisitedRoutes({ commit }, route) {
    commit('delLeftVisitedRoutes', route)
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 删除当前标签页右边全部多标签页
   * @param {*} { commit }
   * @param {*} route
   */
  delRightVisitedRoutes({ commit }, route) {
    commit('delRightVisitedRoutes', route)
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 删除全部多标签页
   * @param {*} { commit }
   */
  delAllVisitedRoutes({ commit }) {
    commit('delAllVisitedRoutes')
  }
}
export default { state, getters, mutations, actions }
