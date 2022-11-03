import { message } from 'ant-design-vue'
import { Method } from 'axios'
import request from '@/utils/request'

export type UploadRequestConfig<D = any> = {
  url: string
  method?: Method | string
  headers?: HeadersInit
  data?: D
  params?: any
  showTip?: boolean // 展示下载中字样
}

export default async function uploadFile(options: UploadRequestConfig): Promise<ResponseResult> {
  if (options.showTip) {
    message.loading({
      content: `文件上传中，请耐心等待。。。。`,
      key: 'uploading',
      duration: 0
    })
  }
  const headers = {
    ...options.headers,
    'Content-Type': 'multipart/form-data'
  }
  const res = await request({
    url: options.url,
    method: options.method,
    data: options.data,
    params: options.params,
    headers: headers
  })
  if (options.showTip) {
    if (res.code === 0) {
      message.success({
        content: `导入成功`,
        key: 'uploading'
      })
    } else {
      message.error({
        content: res.msg || '操作异常',
        key: 'uploading'
      })
    }
  }

  return res
}
