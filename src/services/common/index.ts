import type { DownLoadRequestConfig } from '@/utils/fetchFile'
import fetchFile from '@/utils/fetchFile'
import uploadFile, { UploadRequestConfig } from '@/utils/uploadFile'

export function download(params: DownLoadRequestConfig) {
  const { showTip = true, method = 'get' } = params
  return fetchFile({
    ...params,
    showTip,
    method
  })
}
export function upload(params: UploadRequestConfig) {
  const { showTip = true, method = 'post' } = params
  return uploadFile({
    ...params,
    showTip,
    method
  })
}
