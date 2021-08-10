import request from '/@/utils/request'
import config from '/config/config'

const { tokenName } = config.defaultSettings

export async function login(data) {
  return request('/login', {
    method: 'post',
    data
  })
}

export async function socialLogin(data) {
  return request('/socialLogin', {
    method: 'post',
    data
  })
}

export function getUserInfo(accessToken) {
  //此处为了兼容mock.js使用data传递accessToken，如果使用mock可以走headers
  return request('/userInfo', {
    method: 'post',
    data: {
      [tokenName]: accessToken
    }
  })
}

export function logout() {
  return request('/logout', {
    method: 'post'
  })
}

export function register() {
  return request('/register', {
    method: 'post'
  })
}
