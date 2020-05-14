import { login, login2, logout, getInfo, getPerms } from '@/api/user'
import { getToken, setToken, removeToken, setAToken, removeAToken, getAToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    accessToken: getAToken(),
    refreshToken: '',
    t: '',
    perms: [],
    userInfo: {},
    cachePerms: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ATOKEN: (state, accessToken) => {
    state.accessToken = accessToken
  },
  SET_RTOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  },
  SET_T: (state, t) => {
    state.t = t
  },
  SET_PERMS: (state, perms) => {
    console.log('SET_PERMS')
    console.log(perms)
    state.perms = perms
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_CACHEPERMS: (state, result) => {
    state.cachePerms = result
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  login2({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login2({ account: username.trim(), password: password }).then(res => {
        console.log('store login2')
        const data = res.data
        console.log(data)
        commit('SET_ATOKEN', data.accessToken)
        commit('SET_RTOKEN', data.refreshToken)
        commit('SET_PERMS', data.perms)
        commit('SET_T', data.atExpire)
        commit('SET_USERINFO', data.user)
        setAToken(data.accessToken)
        console.log('store login2')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getPerms({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log('enter getPerms store')
      console.log(state.perms)
      // if (state.perms && state.perms.length > 0) {
      if (state.cachePerms) {
        console.log('cache perms')
        resolve(state.perms)
      } else {
        getPerms().then(resp => {
          const perms = resp.data.perms
          if (!perms) {
            reject('Verification failed, please Login again.')
          }
          // roles must be a non-empty array
          if (!perms || perms.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }
          commit('SET_PERMS', perms)
          commit('SET_CACHEPERMS', true)
          console.log('getHttpPerms')
          console.log(perms)
          resolve(perms)
        }).catch(error => {
          reject(error)
        })
      }
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeAToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

