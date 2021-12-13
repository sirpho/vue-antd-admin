import moment from 'moment'
import 'moment/dist/locale/zh-cn'

moment.locale('zh-cn')

import {
  GAffix,
  GAnchor,
  GResult,
  GProLayout,
  GProTable,
  GBackTop,
  GProModal,
  GProCard,
  GInputSearch,
  GProPageLoading,
  GProPageWrapper,
  GSkeleton,
  GProSkeleton,
  GProWatermark,
  GColorPicker,
  GDocumentation,
  GTagSelect,
  TagSelectOption,
  GProCardGroup,
  GProCardDivider,
  GProCardTabPane,
  GImage,
  GImageViewer,
  GImageViewerGroup,
  GUpload,
  GMaterialView,
  GProField,
  GProForm,
  ProFormItem,
  ProFormText,
  ProFormGroup,
  LightFilter,
} from '/@/components'
import { GScrollbars, CustomIcon } from '/@/components/export'

import {
  List,
  Menu,
  Cascader,
  Rate,
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
    app.component('g-pro-layout', GProLayout)
    app.component('g-pro-table', GProTable)
    app.component('g-pro-modal', GProModal)
    app.component('g-back-top', GBackTop)
    app.component('g-bars', GScrollbars)
    app.component('g-pro-page-wrapper', GProPageWrapper)
    app.component('g-icon', CustomIcon)
    app.component('g-pro-page-loading', GProPageLoading)
    app.component('g-input-search', GInputSearch)
    app.component('g-result', GResult)
    app.component('g-skeleton', GSkeleton)
    app.component('g-pro-skeleton', GProSkeleton)
    app.component('g-pro-watermark', GProWatermark)
    app.component('g-color', GColorPicker)
    app.component('g-pro-card', GProCard)
    app.component('g-pro-card-group', GProCardGroup)
    app.component('g-pro-card-divider', GProCardDivider)
    app.component('g-pro-card-tab-pane', GProCardTabPane)
    app.component('g-upload', GUpload)
    app.component('g-image', GImage)
    app.component('g-image-viewer', GImageViewer)
    app.component('g-image-viewer-group', GImageViewerGroup)
    app.component('g-affix', GAffix)
    app.component('g-anchor', GAnchor)
    app.component('g-doc', GDocumentation)
    app.component('g-tag-select', GTagSelect)
    app.component('g-tag-select-option', TagSelectOption)
    app.component('g-material-view', GMaterialView)
    app.component('g-pro-field', GProField)
    app.component('g-pro-form', GProForm)
    app.component('g-pro-form-item', ProFormItem)
    app.component('g-pro-form-text', ProFormText)
    app.component('g-pro-form-group', ProFormGroup)
    app.component('g-pro-form-light', LightFilter)
    app.use(Menu)
    app.use(Cascader)
    app.use(Upload)
    app.use(Rate)
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
