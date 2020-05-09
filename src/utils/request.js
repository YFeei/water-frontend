import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import '@/api/user'
import { loginByRToken } from '../api/user';
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
    // do something before request is sent

    // const t = store.getters.t
    // if (t && t < (new Date()).valueOf()) {
    //   const refreshToken = store.getter.refreshToken
    //   if (refreshToken !== null && refreshToken !== '') {
    //     loginByRToken(refreshToken).then(resp => {
    //       const AToken = resp.data.data.accessToken
    //       const RToken = resp.data.data.refreshToken
    //       store.commit('user/SET_ATOKEN', AToken)
    //       store.commit('user/SET_TROKEN', RToken)
    //     })
    //   } else {
    //     throw new Error('relogin')
    //   }
    // }
    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    // }
    if (store.getters.accessToken) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['accessToken'] = store.getters.accessToken
    }
    config.data = qs.stringify(config.data)
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
    if (res.code !== 4001) {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      if (res.code === 4003) {
        console.log('code 4003')
        const refreshToken = store.getter.refreshToken
        if (refreshToken && refreshToken !== '' && !isRefreshing) {
          console.log('RToken存在，获取新的Token')
          isRefreshing = true
          return loginByRToken(refreshToken).then(resp => {
            const AToken = resp.data.data.accessToken
            const RToken = resp.data.data.refreshToken
            store.commit('user/SET_ATOKEN', AToken)
            store.commit('user/SET_TROKEN', RToken)
            const config = response.config
            return service(config)
          }).catch(res => {
            // 跳转登陆页面
          }).finally(() => {
            isRefreshing = false
          })
        } else {
          // 无refreshToken，跳转登陆页面
        }
      } else if (res.code === 4005) {
        // refreshToken 失效，重新登陆
        return Promise.reject(new Error(res.message))
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      const t = res.atExpire
      if (t) {
        store.commit('user/SET_T', res.s)
      }
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
