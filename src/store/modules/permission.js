import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

function hasPermission2(perms, route) {
  console.log('hasPermisssion2')
  console.log(route)
  if (route.meta && route.meta.perms) {
    // return perms.some(perm => route.meta.perms.includes(perm))
    return route.meta.perms.some(perm => {
      for (let j = 0; j < perms.length; j++) {
        if (perms[j].indexOf(perm) !== -1) {
          console.log(perms[j])
          console.log('has perm')
          return true
        }
      }
      return false
    })
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []
//
//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })
//
//   return res
// }

export function filterAsyncRoutes2(routes, perms) {
  const res = []
  console.log('filterAsyncRoutes2:' + perms)
  routes.forEach(route => {
    const tmp = { ...route }
    console.log('tmp')
    console.log(tmp)
    if (hasPermission2(perms, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes2(tmp.children, perms)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  loadRoute: false,
  isRefreshing: false
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_LOADROUTE: (state, routes) => {
    state.routes = routes
  },
  SET_ISREFRESHING: (state, isRefreshing) => {
    state.isRefreshing = isRefreshing
  }
}

const actions = {
  // generateRoutes({ commit }, roles) {
  //   return new Promise(resolve => {
  //     let accessedRoutes
  //     if (roles.includes('admin')) {
  //       accessedRoutes = asyncRoutes || []
  //     } else {
  //       accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
  //     }
  //     commit('SET_ROUTES', accessedRoutes)
  //     resolve(accessedRoutes)
  //   })
  // },

  generateRoutes2({ commit }, perms) {
    return new Promise(resolve => {
      let accessedRoutes
      console.log('genrateRoute2:' + perms)
      if (perms.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes2(asyncRoutes, perms)
      }
      commit('SET_ROUTES', accessedRoutes)
      // commit('SET_LOADROUTE', true)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
