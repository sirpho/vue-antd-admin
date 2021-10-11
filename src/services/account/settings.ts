import request from '/@/utils/request'
import type { CurrentUser, GeographicItemType } from './data.d'

export function queryCurrent(): Promise<{ data: CurrentUser }> {
  return request({
    url: '/accountSettingCurrentUser',
    method: 'post'
  })
}

export function queryProvince(): Promise<{ data: GeographicItemType[] }> {
  return request({
    url: '/geographic/province',
    method: 'post'
  })
}

export function queryCity(province: string): Promise<{ data: GeographicItemType[] }> {
  return request({
    url: `/geographic/city/${province}`,
    method: 'post'
  })
}
