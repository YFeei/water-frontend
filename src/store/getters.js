const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  accessToken: state => state.user.accessToken,
  refreshToken: state => state.user.refreshToken,
  t: state => state.user.t,
  perms: state => state.user.perms,
  userInfo: state => state.user.userInfo,
  loadRoute: state => state.permission.loadRoute,
  isRefreshing: state => state.permission.isRefreshing
}
export default getters
