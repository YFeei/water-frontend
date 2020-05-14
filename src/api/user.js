import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function login2(data) {
  console.log('data:')
  console.log(data)
  return request({
    url: '/sys/user/login',
    method: 'post',
    data: data
  })
}

export function getPerms(accessToken) {
  return request({
    url: '/sys/user/perm',
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function loginByRToken(refreshToken) {
  return request({
    url: '/sys/user/login/token',
    method: 'post',
    data: { refreshToken }
  })
}

export function getUserList(page = 1, pageSize = 10, search) {
  const params = { page, pageSize }
  for (const key in search) {
    params[key] = search[key]
  }
  return request({
    url: 'sys/user',
    method: 'get',
    params: params
  })
}

export function updateUserStatus(id, status) {
  return request({
    url: '/sys/user/status',
    method: 'put',
    data: { id, status }
  })
}

export function getUserById(id) {
  return request({
    url: '/sys/user/id/' + id,
    method: 'get'
  })
}

export function updateUser(user) {
  return request({
    url: '/sys/user',
    method: 'put',
    data: { ...user }
  })
}

export function addUser(user) {
  return request({
    url: '/sys/user',
    method: 'post',
    data: { ...user }
  })
}

export function deleteUser(userIds) {
  return request({
    url: '/sys/user',
    method: 'delete',
    type: 'POST',
    params: userIds
  })
}

export function getUserByAccount(account) {
  return request({
    url: '/sys/user/account/' + account,
    method: 'get'
  })
}
