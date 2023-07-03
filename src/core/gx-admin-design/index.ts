import { PageLoading, FileUploader, StatusPop, DataPicker, UploadButton } from '@/components'

const gxAdminDesign = (app) => {
  // pro-loading
  app.component('GPageLoading', PageLoading)
  // file-uploader
  app.component('FileUploader', FileUploader)
  // status-pop
  app.component('StatusPop', StatusPop)
  // data-picker
  app.component('DataPicker', DataPicker)
  // upload-button
  app.component('UploadButton', UploadButton)
}
export default gxAdminDesign
