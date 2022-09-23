import { MockMethod } from 'vite-plugin-mock'
import config from '/config/config'
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util'

const { tokenName } = config.defaultSettings


const accessTokens = {
  admin: 'admin-accessToken',
}

const account = {
  admin: 'admin',
}

export default [
  {
    url: '/mock-server/sys/login',
    method: 'post',
    response: ({ body }) => {
      const { userName, password } = body
      const accessToken = accessTokens[userName]
      if (account[userName] !== password || !accessToken) {
        return {
          code: 500,
          msg: '帐户或密码不正确。'
        }
      }
      return {
        code: 200,
        msg: 'success',
        data: {
          [tokenName]: accessToken,
          expires_in: 720
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
