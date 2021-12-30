import {
  GImage,
  GResult,
  GSkeleton,
  GMaterialView,
  GImageViewer,
  GImageViewerGroup,
  GBackTop,
  GInputSearch,
  GColorPicker,
  GAffix,
  GAnchor
} from '/@/components'
import { GScrollbars } from '/@/components/export'

const gxDesign = (app) => {
  app.component('g-image', GImage)
  app.component('g-affix', GAffix)
  app.component('g-result', GResult)
  app.component('g-anchor', GAnchor)
  app.component('g-bars', GScrollbars)
  app.component('g-back-top', GBackTop)
  app.component('g-skeleton', GSkeleton)
  app.component('g-color', GColorPicker)
  app.component('g-input-search', GInputSearch)
  app.component('g-image-viewer', GImageViewer)
  app.component('g-material-view', GMaterialView)
  app.component('g-image-viewer-group', GImageViewerGroup)
}
export default gxDesign
