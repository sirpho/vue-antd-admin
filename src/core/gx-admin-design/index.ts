import { Documentation, PageLoading, FileUploader } from '@/components'

const gxAdminDesign = (app) => {
  // doc
  app.component('GDoc', Documentation)
  // pro-loading
  app.component('GPageLoading', PageLoading)
  // file-uploader
  app.component('FileUploader', FileUploader)
}
export default gxAdminDesign
