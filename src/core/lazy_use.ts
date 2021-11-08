import moment from 'moment'
import 'moment/dist/locale/zh-cn'

moment.locale('zh-cn')

import {
  WAffix,
  WResult,
  WProLayout,
  WProTable,
  WBackTop,
  WModal,
  WProCard,
  WInputSearch,
  WPageLoading,
  WPageWrapper,
  WSkeleton,
  WProSkeleton,
  WProWatermark,
  WProColorPicker,
  WAnchor,
  WDocumentation,
  WTagSelect,
  WTagSelectOption,
  WProCardGroup,
  WProCardDivider,
  WProCardTabPane,
  WImage,
  WImageViewer,
  WImageViewerGroup,
  WUpload,
  WMaterialView,
} from '/@/components'
import { WScrollbars, CustomIcon } from '/@/components/export'

import {
  List,
  Descriptions,
  Statistic,
  InputNumber,
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
  Slider,
  Carousel,
  Anchor,
  BackTop,
  Result,
  Popconfirm,
  Badge,
  AutoComplete,
  Upload
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
    app.component('w-pro-color', WProColorPicker)
    app.component('w-pro-card', WProCard)
    app.component('w-pro-card-group', WProCardGroup)
    app.component('w-pro-card-divider', WProCardDivider)
    app.component('w-pro-card-tab-pane', WProCardTabPane)
    app.component('w-upload', WUpload)
    app.component('w-image', WImage)
    app.component('w-image-viewer', WImageViewer)
    app.component('w-image-viewer-group', WImageViewerGroup)
    app.component('w-affix', WAffix)
    app.component('w-anchor', WAnchor)
    app.component('w-doc', WDocumentation)
    app.component('w-tag-select', WTagSelect)
    app.component('w-tag-select-option', WTagSelectOption)
    app.component('w-material-view', WMaterialView)
    app.use(Upload)
    app.use(AutoComplete)
    app.use(Result)
    app.use(Badge)
    app.use(Popconfirm)
    app.use(Descriptions)
    app.use(InputNumber)
    app.use(Slider)
    app.use(Anchor)
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
