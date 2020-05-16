import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { removeAToken, removeRToken } from '@/utils/auth'
import router from '@/router'
import '@/api/user'
import { loginByRToken } from '../api/user'
import qs from 'qs'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    /* do something before request is sent

    const t = store.getters.t
    if (t && t < (new Date()).valueOf()) {
      const refreshToken = store.getter.refreshToken
      if (refreshToken !== null && refreshToken !== '') {
        loginByRToken(refreshToken).then(resp => {
          const AToken = resp.data.data.accessToken
          const RToken = resp.data.data.refreshToken
          store.commit('user/SET_ATOKEN', AToken)
          store.commit('user/SET_TROKEN', RToken)
        })
      } else {
        throw new Error('relogin')
      }
    }
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }*/
    if (store.getters.accessToken) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['accessToken'] = store.getters.accessToken
    }
    config.data = qs.stringify(config.data)
    // config.data = JSON.stringify(config.data)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

let isRefreshing = false
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    const t = res.atExpire
    if (t) {
      store.commit('user/SET_T', res.s)
    }
    return res
  },
  error => {
    console.log('err' + error) // for debug
    console.log('4003')
    const data = error.response.data
    const url = error.response.config.url
    const config = error.response.config
    console.log('data:')
    console.log(data)
    console.log(url)

    if (data.code !== 4001) {
      /* Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }*/
      if (data.code === 4003) {
        if (url.indexOf('/sys/user/login/token') !== -1) {
          console.log('/sys/user/  jump route')
          store.dispatch('user/logout')
          store.dispatch('permission/reset')
          removeAToken()
          removeRToken()
          router.push({ path: '/login' })
          return Promise.reject(error)
        }
        console.log('code 4003')
        const refreshToken = store.getters.refreshToken
        console.log('refreshToken=' + refreshToken)
        console.log('isRefreshing=' + isRefreshing)
        if (refreshToken && refreshToken !== '' && !isRefreshing) {
          console.log('RToken存在，获取新的Token')
          isRefreshing = true
          return loginByRToken(refreshToken).then(resp => {
            console.log('response.config')
            const AToken = resp.data.accessToken
            const RToken = resp.data.refreshToken
            /* console.log(config)
            console.log('atoken' + AToken)
            console.log('rtoken' + RToken)*/
            config.url = config.url.replace('/dev-api', '')
            store.commit('user/SET_ATOKEN', AToken)
            store.commit('user/SET_RTOKEN', RToken)
            return service(config)
          }).catch(res => {
            // 跳转登陆页面
            console.log('relogin err=')
            console.log(res)
          }).finally(() => {
            isRefreshing = false
          })
        } else {
          // 无refreshToken，跳转登陆页面
          router.push({ path: '/login' })
          console.log('no refreshToken')
        }
      }
      // return Promise.reject(new Error(data.message || 'Error'))
    }
    Message({
      message: data.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
