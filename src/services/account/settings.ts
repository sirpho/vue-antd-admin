import request from '/@/utils/request'
import type { CurrentUser, GeographicItemType } from './typings'

export function queryCurrent(): Promise<{ data: CurrentUser }> {
  return request({
    url: '/accountSettingCurrentUser',
    method: 'post',
    isMock: true
  })
}

export function queryProvince(): Promise<{ data: GeographicItemType[] }> {
  return request({
    url: '/geographic/province',
    method: 'post',
    isMock: true
  })
}

export function queryCity(province: string): Promise<{ data: GeographicItemType[] }> {
  return request({
    url: `/geographic/city/${province}`,
    method: 'post',
    isMock: true
  })
}
