import ProLayout, { PageContainer } from '@gx-design/ProLayout'
import ProTable from '@gx-design/ProTable'
import ProModal from '@gx-design/ProModal'
import ProWatermark from '@gx-design/ProWatermark'

const gxProDesign = (app) => {
  // pro-layout
  app.component('GProLayout', ProLayout)
  // pro-wrapper
  app.component('GProPageContainer', PageContainer)
  // pro-table
  app.component('GProTable', ProTable)
  // pro-modal
  app.component('GProModal', ProModal)
  // pro-watermark
  app.component('GProWatermark', ProWatermark)
}
export default gxProDesign
