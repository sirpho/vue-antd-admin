const state = () => ({
  data: {}
})
const getters = {
  data: (state) => state.data
}
const mutations = {
  setDictData(state, { type, data }) {
    state.data[type] = data
  }
}
const actions = {
  setDictData({ commit }, { type, data }) {
    commit('setDictData', { type, data })
  }
}
export default { state, getters, mutations, actions }
