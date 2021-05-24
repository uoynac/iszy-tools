export default {
  namespaced: true,
  state: () => ({
    statistics: []
  }),
  getters: {
    recent (state) {
      return [...state.statistics].sort(function (a, b) {
        return b.lastAccessTime - a.lastAccessTime
      }).slice(0, 3)
    },
    most (state) {
      return [...state.statistics].sort(function (a, b) {
        return b.times - a.times
      }).slice(0, 3)
    }
  },
  mutations: {
    access (state, { name, link }) {
      if (Array.isArray(state.statistics)) {
        const tmp = state.statistics.filter(item => (item.name === name))
        if (tmp.length > 0) {
          tmp[0].times++
          tmp[0].lastAccessTime = new Date().getTime()
          tmp[0].link = link
        } else {
          state.statistics.push({
            name, link, times: 1, lastAccessTime: new Date().getTime()
          })
        }
      } else {
        state.statistics = [{
          name, link, times: 1, lastAccessTime: new Date().getTime()
        }]
      }
    },
    clearHistory (state) {
      state.statistics = []
    }
  },
  actions: {
    access ({ commit }, { name, link }) {
      commit('access', { name, link })
    },
    clearHistory ({ commit }) {
      commit('clearHistory')
    }
  }
}
