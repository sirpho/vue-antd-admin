import {
  Row,
  Col,
  Menu,
  Card,
  Space,
  Input,
  Button,
  Radio,
  Dropdown,
  Avatar,
  Spin,
  Tooltip,
  Table,
  Divider,
  message,
  Form,
  Popconfirm,
  InputNumber,
  Slider,
  List,
  TimePicker,
  Typography,
  Tree,
  DatePicker,
  Select,
  Switch,
  Upload,
  Checkbox,
  AutoComplete,
  Modal,
  Descriptions,
  Tabs,
  DescriptionsItem,
  Badge,
  Progress
} from 'ant-design-vue'

const antDesign = (app) => {
  app.use(Menu)
  app.use(Popconfirm)
  app.use(InputNumber)
  app.use(Slider)
  app.use(List)
  app.use(TimePicker)
  app.use(Typography)
  app.use(Space)
  app.use(Tree)
  app.use(Card)
  app.use(Form)
  app.use(DatePicker)
  app.use(Select)
  app.use(Switch)
  app.use(Upload)
  app.use(Input)
  app.use(Button)
  app.use(Radio)
  app.use(Checkbox)
  app.use(Row)
  app.use(Col)
  app.use(Dropdown)
  app.use(Avatar)
  app.use(Spin)
  app.use(Tooltip)
  app.use(Table)
  app.use(Divider)
  app.use(Modal)
  app.use(AutoComplete)
  app.use(Descriptions)
  app.use(Tabs)
  app.use(DescriptionsItem)
  app.use(Badge)
  app.use(Progress)
  message.config({
    duration: 2,
    maxCount: 1
  })
}

export default antDesign
