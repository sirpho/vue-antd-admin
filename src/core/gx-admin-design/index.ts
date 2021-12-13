import { CustomIcon } from '/@/components/export'
import { GDocumentation, GTagSelect, TagSelectOption } from '/@/components'

const gxAdminDesign = (app) => {
  // icon
  app.component('g-icon', CustomIcon)
  // doc
  app.component('g-doc', GDocumentation)
  // tag-select
  app.component('g-tag-select', GTagSelect)
  app.component('g-tag-select-option', TagSelectOption)
}
export default gxAdminDesign
