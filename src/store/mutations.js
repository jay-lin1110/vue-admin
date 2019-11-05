import * as Types from './mutation-types'

const Mutations = {
  [Types.SET_USER](state, payload) {
    if (!payload) {
      state.objUser = {}
    } else {
      state.objUser = { ...state.objUser, ...payload }
    }
  },

  [Types.SET_AUTHENTICATED](state, payload) {
    if (!payload) {
      state.isAuthenticated = false
    } else {
      state.isAuthenticated = payload
    }
  }
}

export default Mutations
