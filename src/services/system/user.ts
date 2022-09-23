import request from '@/utils/request'
import { download } from '../common/index'

export interface userQueryParam {
  page?: number;
  limit?: number;
  // 账号
  uid?: string;
  // 姓名
  uname?: string;
  // 公司
  companyId?: string;
}

export interface userParam {
  id?: number
  uid: string
  uname: string
  status: string
  companyList?: {companyId: string}[]
}

// 用户列表
export function getUserList(param: userQueryParam) {
  return request({
    url: '/base/user/list',
    method: 'get',
    params: param
  })
}

// 导出用户列表
export function exportUserList(param: userQueryParam) {
  return download({
    url: '/base/user/export',
    params: param
  })
}

// 用户详情
export function getUserInfo(userId: String) {
  return request({
    url: `/base/user/info/${userId}`,
    method: 'get'
  })
}

// 编辑用户
export function updateUser(data: userParam) {
  return request({
    url: `/base/user/update`,
    method: 'post',
    data
  })
}

// 启用用户
export function enableUser(data: number[]) {
  return request({
    url: `/base/user/enable`,
    method: 'post',
    data
  })
}
// 禁用用户
export function disableUser(data: number[]) {
  return request({
    url: `/base/user/disable`,
    method: 'post',
    data
  })
}
