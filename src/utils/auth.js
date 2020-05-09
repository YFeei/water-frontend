import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const AToken = 'accessToken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getAToken() {
  return Cookies.get(AToken)
}

export function setAToken(token) {
  return Cookies.set(AToken, token)
}

export function removeAToken() {
  return Cookies.remove(AToken)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setRToken(token) {
  localStorage.setItem('RToken', token)
}

export function getRToken() {
  return localStorage.getItem('RToken')
}

export function hasPerm(perms, perm) {
  for (let i = 0; i < perms.length; i++) {
    if (perms[i].indexOf(perm) !== -1) return true
  }
  return false
}
