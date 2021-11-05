import fetchFile from '/@/utils/fetchFile'

export function download(params) {
  const { showTip = true } = params
  return fetchFile({
    url: params.url,
    direct: params.direct,
    data: params.data,
    params: params.params,
    name: params.name,
    showTip: showTip,
    method: params.method
  })
}
