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
  GProCardTabPane,
  GProField,
  GProForm,
  ProFormItem,
  ProFormText,
  ProFormGroup,
  LightFilter
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
  // pro-field
  app.component('g-pro-field', GProField)
  // pro-form
  app.component('g-pro-form', GProForm)
  app.component('g-pro-form-light', LightFilter)
  app.component('g-pro-form-group', ProFormGroup)
  app.component('g-pro-form-item', ProFormItem)
  app.component('g-pro-form-text', ProFormText)
  // pro-skeleton
  app.component('g-pro-skeleton', GProSkeleton)
  app.component('g-pro-watermark', GProWatermark)
  // pro-wrapper
  app.component('g-pro-page-wrapper', GProPageWrapper)
  // pro-loading
  app.component('g-pro-page-loading', GProPageLoading)
}
export default gxProDesign
