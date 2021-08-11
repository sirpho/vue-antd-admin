import request from '/@/utils/request'

export function notice() {
  return request({
    url: '/project/notice',
    method: 'get'
  })
}

export function activities() {
  return request({
    url: '/activities',
    method: 'get'
  })
}

export function radar() {
  return request({
    url: '/radar',
    method: 'get'
  })
}
