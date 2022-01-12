import { Documentation, PageLoading, CustomIcon } from '/@/components'

const gxAdminDesign = (app) => {
  // icon
  app.component('g-icon', CustomIcon)
  // doc
  app.component('g-doc', Documentation)
  // pro-loading
  app.component('g-page-loading', PageLoading)
}
export default gxAdminDesign
