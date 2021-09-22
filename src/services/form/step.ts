import request from '/@/utils/request'

export function getStepForm(data) {
  return request({
    url: '/stepForm',
    method: 'post',
    data
  })
}
