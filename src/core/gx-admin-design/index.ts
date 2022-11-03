import { Documentation, PageLoading, FileUploader, UploadButton } from '@/components'

const gxAdminDesign = (app) => {
  // doc
  app.component('GDoc', Documentation)
  // pro-loading
  app.component('GPageLoading', PageLoading)
  // file-uploader
  app.component('FileUploader', FileUploader)
  // upload-button
  app.component('UploadButton', UploadButton)
}
export default gxAdminDesign
