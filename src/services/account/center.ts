import request from '/@/utils/request'
import type { CurrentUser, ListItemDataType } from './data.d'

export function queryCurrent(): Promise<{ data: CurrentUser }> {
  return request({
    url: '/currentUserDetail',
    method: 'post'
  })
}

export function queryFakeList(params: {
  count: number;
}): Promise<{ data: ListItemDataType[] }> {
  return request({
    url: '/fake_list_Detail',
    method: 'post',
    data: params
  })
}
