import {
  GProLayout,
  GProTable,
  GProModal,
  GProPageWrapper,
  GProPageLoading,
  GProSkeleton,
  GProWatermark,
  GProCard,
  GProCardGroup,
  GProCardDivider,
  GProCardTabPane
} from '/@/components'

const gxProDesign = (app) => {
  // pro-layout
  app.component('g-pro-layout', GProLayout)
  // pro-card
  app.component('g-pro-card', GProCard)
  app.component('g-pro-card-group', GProCardGroup)
  app.component('g-pro-card-divider', GProCardDivider)
  app.component('g-pro-card-tab-pane', GProCardTabPane)
  // pro-table
  app.component('g-pro-table', GProTable)
  // pro-modal
  app.component('g-pro-modal', GProModal)

  // pro-skeleton
  app.component('g-pro-skeleton', GProSkeleton)
  app.component('g-pro-watermark', GProWatermark)
  // pro-wrapper
  app.component('g-pro-page-wrapper', GProPageWrapper)
  // pro-loading
  app.component('g-pro-page-loading', GProPageLoading)
}
export default gxProDesign
