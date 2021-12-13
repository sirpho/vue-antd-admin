import moment from 'moment'
import 'moment/dist/locale/zh-cn'

moment.locale('zh-cn')

import antDesign from './ant-design'
import gxDesign from './gx-design'
import gxProDesign from './gx-pro-design'
import gxAdminDesign from './gx-admin-design'

export default {
  install(app) {
    antDesign(app)
    gxDesign(app)
    gxProDesign(app)
    gxAdminDesign(app)
  }
}
