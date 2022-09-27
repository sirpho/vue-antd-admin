import request from '@/utils/request'

// 查询字典数据详细
export function getDictOptions(dictCode) {
  return request({
    url: '/dict/data/type/' + dictCode,
    method: 'get',
    isMock: true
  })
}
