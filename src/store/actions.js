import * as Types from './mutation-types'
import { getUserById } from '@/api/user'

const Actions = {
  async setUser({ commit }, payload) {
    const { id } = payload
    const { data } = await getUserById(id)
    commit(Types.SET_USER, data)
  },

  setAuthenticated({ commit }, payload) {
    commit(Types.SET_AUTHENTICATED, payload)
  },

  signOut({ commit }) {
    commit(Types.SET_USER, null)
    commit(Types.SET_AUTHENTICATED, false)
  }
}

export default Actions
