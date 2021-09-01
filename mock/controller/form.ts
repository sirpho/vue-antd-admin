import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/mock-server/basicForm',
    method: 'post',
    response: ({ body }) => {
      let data = {}
      const { id } = body
      if (id) data = {
        title: 'gx12358',
        startTime: '2021-09-26 00:00:00',
        endTime: '2021-09-26 00:00:00',
        goal: '赚钱',
        standard: '厉害',
        client: 'sf12358',
        invites: 'gf12358',
        weight: '150',
        publicType: '2',
        publicUsers: '1'
      }
      return {
        code: 200,
        msg: 'success',
        data
      }
    }
  }
] as MockMethod[]
