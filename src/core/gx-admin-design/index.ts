import { Documentation, PageLoading } from '@/components'

const gxAdminDesign = (app) => {
  // doc
  app.component('GDoc', Documentation)
  // pro-loading
  app.component('GPageLoading', PageLoading)
}
export default gxAdminDesign
