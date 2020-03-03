import request from '@/utils/request'
import qs from 'qs'

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

export function getUserList(page = 1, pageSize = 10) {
  return request({
    url: 'sys/user',
    method: 'get',
    params: { page, pageSize }
  })
}