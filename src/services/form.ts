import request from '/@/utils/request'

export interface basicFormParameters {
  title: string;
  startTime: string;
  endTime: string;
  goal: string;
  standard: string;
  client?: string;
  weight?: number;
  publicType?: string;
  publicUsers?: string;
}

export function getBasicForm() {
  return request({
    url: '/basicForm',
    method: 'post'
  })
}

export function updateBasicForm(data: basicFormParameters) {
  return request({
    url: '/update/basicForm',
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
