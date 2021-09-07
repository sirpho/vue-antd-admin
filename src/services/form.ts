import request from '/@/utils/request'

export function getBasicForm(data) {
  return request({
    url: '/basicForm',
    method: 'post',
    data
  })
}

export function getStepForm(data) {
  return request({
    url: '/stepForm',
    method: 'post',
    data
  })
}

export function getAdvancedForm(data) {
  return request({
    url: '/advancedForm',
    method: 'post',
    data
  })
}

export function getAdvancedFormTable(data) {
  return request({
    url: '/advancedFormTable',
    method: 'post',
    data
  })
}
