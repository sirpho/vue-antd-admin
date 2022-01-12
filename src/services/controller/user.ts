import request from '/@/utils/request'
import config from '/config/config'

const { tokenName } = config.defaultSettings

export async function login(data) {
  return request({
    url: '/login',
    method: 'post',
    isMock: true,
    data
  })
}

export async function socialLogin(data) {
  return request({
    url: '/socialLogin',
    method: 'post',
    isMock: true,
    data
  })
}

export function getUserInfo(accessToken) {
  //此处为了兼容mock.js使用data传递accessToken，如果使用mock可以走headers
  return request({
    url: '/userInfo',
    method: 'post',
    isMock: true,
    data: {
      [tokenName]: accessToken
    }
  })
}

export function logout(params) {
  return request({
    url: '/logout',
    method: 'get',
    isMock: true,
    params
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
    isMock: true
  })
}
