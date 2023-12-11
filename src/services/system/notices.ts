import request from '@/utils/request'

// 消息列表
export function getNotices() {
  return request({
    url: '/notice/list',
    method: 'get',
    isMock: true,
  })
}
// 消息已读
export function readNotice(id) {
  return request({
    url: `/notice/read`,
    method: 'post',
    params: {
      id: id
    },
    isMock: true,
  })
}
// 全部消息已读
export function readNoticeAll() {
  return request({
    url: `/notice/read-all`,
    method: 'post',
    isMock: true,
  })
}
