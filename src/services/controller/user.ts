import request from '@/utils/request'

export async function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  return request({
    url: '/userInfo',
    method: 'post',
    isMock: true
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
