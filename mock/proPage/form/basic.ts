import { MockMethod } from 'vite-plugin-mock'
import { builder, getRequestToken, requestParams } from '../../_util'
import { cloneDeep } from 'lodash-es'

export default [
  {
    url: '/mock-server/basicForm',
    method: 'post',
    response: (request: requestParams) => {
      return builder(getRequestToken(request), {
        data: cloneDeep({
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
        })
      })
    }
  }
] as MockMethod[]
