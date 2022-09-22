import Affix from '@gx-design/Affix'
import Result from '@gx-design/Result'
import Anchor from '@gx-design/Anchor'
import BackTop from '@gx-design/BackTop'
import Skeleton from '@gx-design/Skeleton'
import ColorPicker from '@gx-design/ColorPicker'
import InputSearch from '@gx-design/InputSearch'
import Scrollbars from '@gx-design/Scrollbars'
import TagSelect from '@gx-design/TagSelect'
import TagSelectOption from '@gx-design/TagSelect/TagSelectOption'
import Image, { ImageViewer, ImageViewerGroup } from '@gx-design/Image'

const gxDesign = (app) => {
  // image
  app.component('GImage', Image)
  app.component('GImageViewer', ImageViewer)
  app.component('GImageViewerGroup', ImageViewerGroup)
  // affix
  app.component('GAffix', Affix)
  // result
  app.component('GResult', Result)
  // anchor
  app.component('GAnchor', Anchor)
  // backtop
  app.component('GBackTop', BackTop)
  // scrollbars
  app.component('GBars', Scrollbars)
  // skeleton
  app.component('GSkeleton', Skeleton)
  // color-picker
  app.component('GColor', ColorPicker)
  // tag-select
  app.component('GTagSelect', TagSelect)
  app.component('GTagSelectOption', TagSelectOption)
  // input-search
  app.component('GInputSearch', InputSearch)
}
export default gxDesign
