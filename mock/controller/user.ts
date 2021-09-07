import { MockMethod } from 'vite-plugin-mock'
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util'

const accessTokens = {
  admin: 'admin-accessToken',
  editor: 'editor-accessToken',
  test: 'test-accessToken'
}

export default [
  {
    url: '/mock-server/login',
    method: 'post',
    response: ({ body }) => {
      const { username } = body
      const accessToken = accessTokens[username]
      if (!accessToken) {
        return {
          code: 500,
          msg: '帐户或密码不正确。'
        }
      }
      return {
        code: 200,
        msg: 'success',
        data: { accessToken }
      }
    }
  },
  {
    url: '/mock-server/socialLogin',
    method: 'post',
    response: ({ body }) => {
      const { code } = body
      if (!code) {
        return {
          code: 500,
          msg: '未成功获取Token。'
        }
      }
      return {
        code: 200,
        msg: 'success',
        data: { accessToken: accessTokens['admin'] }
      }
    }
  },
  {
    url: '/mock-server/register',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: '模拟注册成功'
      }
    }
  },
  {
    url: '/mock-server/userInfo',
    method: 'post',
    response: ({ body }) => {
      const { accessToken } = body
      let roles = [ 'admin' ]
      let ability = [ 'READ' ]
      let username = 'admin'
      if ('admin-accessToken' === accessToken) {
        roles = [ 'admin' ]
        ability = [ 'READ', 'WRITE', 'DELETE' ]
        username = 'admin'
      }
      if ('editor-accessToken' === accessToken) {
        roles = [ 'editor' ]
        ability = [ 'READ', 'WRITE' ]
        username = 'editor'
      }
      if ('test-accessToken' === accessToken) {
        roles = [ 'admin', 'editor' ]
        ability = [ 'READ' ]
        username = 'test'
      }
      return {
        code: 200,
        msg: 'success',
        data: {
          userId: 926,
          roles,
          ability,
          username,
          nickName: 'gx12358',
          'avatar|1': [
            'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif',
            'https://i.gtimg.cn/club/item/face/img/8/15918_100.gif',
            'https://zbbf9-hw.ahtv.cn/ahtv-obs/20210811/a8247f9a-1e29-8482-3902-5b50573e15e2.jpg'
          ]
        }
      }
    }
  },
  {
    url: '/mock-server/logout',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const { userName } = request.query
      const token = getRequestToken(request)
      if (!token) return resultError('Invalid token')
      const checkUser = accessTokens[userName]
      if (!checkUser) {
        return resultError('Invalid token!')
      }
      return resultSuccess(undefined, { msg: 'Token has been destroyed' })
    }
  }
] as MockMethod[]
