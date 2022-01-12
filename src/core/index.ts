import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)

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
