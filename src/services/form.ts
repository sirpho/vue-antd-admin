import request from '/@/utils/request'

export function getIconList(data) {
  return request({
    url: '/basicForm',
    method: 'post',
    data
  })
}
