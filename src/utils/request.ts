import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import axios from 'axios'
import qs from 'qs'
import { message } from 'ant-design-vue'
import config from '/config/config'
import store from '/@/store'
import router from '/@/router'
import { tansParams } from '/@/utils/util'
import { isArray } from '/@/utils/validate'
import { AxiosCanceler } from './axios/axiosCancel'

export interface CreateAxiosOptions extends AxiosRequestConfig {
  headers?: any;
  customize?: boolean;
  isHttpsUrl?: string;
  ignoreCancelToken?: boolean;
}

let loadingInstance

const { debounce, tokenName } = config.defaultSettings

const { contentType, requestTimeout, successCode } = config.network

const axiosCanceler = new AxiosCanceler()

/**
 * @author gx12358 2539306317@qq.com
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code: number, msg: string) => {
  setTimeout(() => {
    switch (code) {
      case 401:
        message.error(msg || '登录失效')
        store.dispatch('user/resetAll').catch(() => {})
        break
      case 403:
        router.push({ path: '/401' }).catch(() => {})
        break
      default:
        message.error(msg || `后端接口${code}异常`)
        break
    }
  })
}
/**
 * @author gx12358 2539306317@qq.com
 * @description axios初始化
 */
const instance = axios.create({
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType
  }
} as CreateAxiosOptions)
/**
 * @author gx12358 2539306317@qq.com
 * @description axios请求拦截器
 */
instance.interceptors.request.use(
  (config: CreateAxiosOptions) => {
    const {
      headers: { ignoreCancelToken }
    } = config

    const ignoreCancel =
      ignoreCancelToken !== undefined
        ? ignoreCancelToken
        : config?.ignoreCancelToken || true
    !ignoreCancel && axiosCanceler.addPending(config)

    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    config.url = `${import.meta.env.VITE_BASE_URL}${config.url}`
    if (store.getters['user/accessToken'])
      (config).headers[tokenName] = store.getters['user/accessToken']
    if (
      config.data &&
      config.headers['Content-Type'] ===
      'application/x-www-form-urlencoded;charset=UTF-8'
    )
      config.data = qs.stringify(config.data)
    if (debounce.some((item) => config.url?.includes(item))) {
      //这里写加载动画
    }
    return config
  },
  (error: Error | AxiosError) => {
    return Promise.reject(error)
  }
)
/**
 * @author gx12358 2539306317@qq.com
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    response && axiosCanceler.removePending(response.config as CreateAxiosOptions)
    if (loadingInstance) loadingInstance.close()
    const { data, config }: {
      data: any,
      config: CreateAxiosOptions
    } = response
    const { code, msg = '', message = '' } = data as Result
    // 操作正常Code数组
    const codeVerificationArray: any = isArray(successCode)
      ? successCode
      : [ successCode ]
    // 是否操作正常
    if (config.customize) {
      return data
    } else if (codeVerificationArray.includes(code)) {
      return data
    } else {
      handleCode(code, msg || message)
      return Promise.resolve(false)
    }
  },
  (error) => {
    if (loadingInstance) loadingInstance.close()
    const { response } = error
    let errorMessage = error.message || ''
    if (error.response && error.response.data) {
      const { status, data } = response
      handleCode(status, data.msg || errorMessage)
      return Promise.resolve(false)
    } else {
      if (errorMessage === 'Network Error') {
        errorMessage = '后端接口连接异常'
      }
      if (errorMessage.includes('timeout')) {
        errorMessage = '后端接口请求超时'
      }
      if (errorMessage.includes('Request failed with status code')) {
        const code = errorMessage.substr(errorMessage.length - 3)
        errorMessage = '后端接口' + code + '异常'
      }
      message.error(errorMessage || `后端接口未知异常`)
      return Promise.resolve(false)
    }
  }
)
export default instance
