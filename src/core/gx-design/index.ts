import Result from '@gx-design/Result'
import ColorPicker from '@gx-design/ColorPicker'
import Scrollbars from '@gx-design/Scrollbars'

const gxDesign = (app) => {
  // result
  app.component('GResult', Result)
  // scrollbars
  app.component('GBars', Scrollbars)
  // color-picker
  app.component('GColor', ColorPicker)
}
export default gxDesign
