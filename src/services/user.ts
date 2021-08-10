import request from '/@/utils/request'
import config from '/config/config'

const { tokenName } = config.defaultSettings

export async function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export async function socialLogin(data) {
  return request({
    url: '/socialLogin',
    method: 'post',
    data
  })
}

export function getUserInfo(accessToken) {
  //此处为了兼容mock.js使用data传递accessToken，如果使用mock可以走headers
  return request({
    url: '/userInfo',
    method: 'post',
    data: {
      [tokenName]: accessToken
    }
  })
}

export function logout(params) {
  return request({
    url: '/logout',
    method: 'get',
    params
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post'
  })
}
