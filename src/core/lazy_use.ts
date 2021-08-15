import moment from 'moment'
import 'moment/dist/locale/zh-cn'

moment.locale('zh-cn')

import {
  WResult,
  WProTable,
  WBackTop,
  WModal,
  WInputSearch,
  WPageLoading,
  WPageWrapper,
  WSkeleton,
  WProSkeleton,
  WProWatermark,
} from '/@/components'
import { WScrollbars, WProLayout, CustomIcon } from '/@/components/export'

import {
  List,
  Statistic,
  PageHeader,
  TimePicker,
  Typography,
  Space,
  Table,
  Tree,
  Drawer,
  ConfigProvider,
  Layout,
  Input,
  Button,
  Radio,
  Checkbox,
  Row,
  Col,
  Modal,
  Tabs,
  Popover,
  Dropdown,
  Avatar,
  Breadcrumb,
  Spin,
  Menu,
  Tooltip,
  Tag,
  Divider,
  Progress,
  Skeleton,
  message,
  Steps,
  Empty,
  Switch,
  Select,
  Alert,
  notification,
  Pagination,
  Card,
  DatePicker,
  Form,
  Carousel,
  BackTop
} from 'ant-design-vue'

const ant = {
  install(app) {
    app.component('w-pro-layout', WProLayout)
    app.component('w-pro-table', WProTable)
    app.component('w-modal', WModal)
    app.component('w-back-top', WBackTop)
    app.component('w-bars', WScrollbars)
    app.component('w-page-wrapper', WPageWrapper)
    app.component('w-icon', CustomIcon)
    app.component('w-page-loading', WPageLoading)
    app.component('w-input-search', WInputSearch)
    app.component('w-result', WResult)
    app.component('w-skeleton', WSkeleton)
    app.component('w-pro-skeleton', WProSkeleton)
    app.component('w-pro-watermark', WProWatermark)
    app.use(List)
    app.use(PageHeader)
    app.use(Statistic)
    app.use(TimePicker)
    app.use(Typography)
    app.use(Space)
    app.use(Tree)
    app.use(Drawer)
    app.use(Alert)
    app.use(Layout)
    app.use(Card)
    app.use(Form)
    app.use(Table)
    app.use(DatePicker)
    app.use(Select)
    app.use(Switch)
    app.use(Steps)
    app.use(ConfigProvider)
    app.use(Input)
    app.use(Button)
    app.use(Radio)
    app.use(Checkbox)
    app.use(Row)
    app.use(Col)
    app.use(Modal)
    app.use(Tabs)
    app.use(Popover)
    app.use(Dropdown)
    app.use(Avatar)
    app.use(Breadcrumb)
    app.use(Spin)
    app.use(Menu)
    app.use(Tooltip)
    app.use(Tag)
    app.use(Divider)
    app.use(Progress)
    app.use(Skeleton)
    app.use(Empty)
    app.use(Pagination)
    app.use(notification)
    app.use(Carousel)
    app.use(BackTop)
    message.config({
      duration: 2,
      maxCount: 1
    })
    app.config.globalProperties.$message = message
    app.config.globalProperties.$antdmodal = Modal
    app.config.globalProperties.$antdmessage = message
    app.config.globalProperties.$antdconfirm = Modal.confirm
    app.config.globalProperties.$notification = notification
    app.config.globalProperties.$info = Modal.info
    app.config.globalProperties.$success = Modal.success
    app.config.globalProperties.$error = Modal.error
    app.config.globalProperties.$warning = Modal.warning
  }
}
export default ant
