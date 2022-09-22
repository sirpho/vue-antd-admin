import ProLayout, { PageContainer } from '@gx-design/ProLayout'
import ProTable from '@gx-design/ProTable'
import ProModal from '@gx-design/ProModal'
import ProWatermark from '@gx-design/ProWatermark'
import ProSkeleton from '@gx-design/ProSkeleton'
import ProCard, {
  GProCardGroup,
  GProCardDivider,
  GProCardTabPane
} from '@gx-design/ProCard'

const gxProDesign = (app) => {
  // pro-layout
  app.component('GProLayout', ProLayout)
  // pro-wrapper
  app.component('GProPageContainer', PageContainer)
  // pro-card
  app.component('GProCard', ProCard)
  app.component('GProCardGroup', GProCardGroup)
  app.component('GProCardDivider', GProCardDivider)
  app.component('GProCardTabPane', GProCardTabPane)
  // pro-table
  app.component('GProTable', ProTable)
  // pro-modal
  app.component('GProModal', ProModal)
  // pro-skeleton
  app.component('GProSkeleton', ProSkeleton)
  // pro-watermark
  app.component('GProWatermark', ProWatermark)
}
export default gxProDesign
