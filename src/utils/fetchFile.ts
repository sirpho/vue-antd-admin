import { message } from 'ant-design-vue'
import config from '/config/config'
import store from '/@/store'
import { tansParams } from '/@/utils/util'

const { tokenName } = config.defaultSettings
export default async function fetchFile(options) {
  if (options.showTip) {
    message.loading({
      content: `下载中，请耐心等待。。。。`,
      key: 'updatable',
      duration: 0
    })
  }
  const baseURL = `${import.meta.env.VITE_BASE_URL}`
  let newUrl = baseURL + options.url
  if (options.direct) {
    newUrl = options.url
  }
  const opations: any = {
    method: options.method,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  if (store.getters['user/accessToken'])
    opations.headers[tokenName] = store.getters['user/accessToken']
  if (options.params || options.data) {
    let url = newUrl + '?' + tansParams(options.params || options.data)
    url = url.slice(0, -1)
    newUrl = url
  }
  if (options.method === 'post') {
    if (options.data) opations.body = JSON.stringify(options.data)
  }
  let isFail = true
  try {
    const response: Response = await fetch(newUrl, opations)
    if (response.status && response.status === 200) {
      const fileName = options.name
        ? options.name
        : response.headers.get('content-disposition')
          ? response.headers.get('content-disposition')?.split(';')[1].split('=')[1]
          : ''
      const blobResponse = await response.blob()
      if (blobResponse) {
        const a = window.document.createElement('a')
        const downUrl = window.URL.createObjectURL(blobResponse)
        a.href = downUrl
        a.download = `${decodeURI(fileName)}`
        a.click()
        if (options.showTip) {
          message.success({
            content: `下载成功！`,
            key: 'updatable'
          })
        }
        window.URL.revokeObjectURL(downUrl)
        isFail = false
      }
    }
  } catch (_) {
    isFail = true
  }

  if (isFail) {
    message.error({
      content: `下载失败！`,
      key: 'updatable'
    })
    return false
  }
  return true
}