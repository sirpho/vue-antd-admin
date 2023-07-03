import request from "@/utils/request"

export async function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    isMock: true,
    data,
  })
}

export function getUserInfo() {
  return request({
    url: '/sys/userInfo',
    method: 'post',
    isMock: true
  })
}

export function logout() {
  return request({
    url: '/getUserInfo/logout',
    method: 'get',
    isMock: true
  })
}
