import logo from '/@/assets/logo.png'

export const layoutProps = {
  title: {
    type: String,
    required: false,
    default: 'Wd Pro Admin'
  },
  logo: {
    type: String,
    required: false,
    default: logo
  },
  iconfontUrl: {
    type: String,
    required: false,
    default: ''
  },
  contentStyle: {
    type: Object,
    required: false,
    default: () => {
      return {}
    }
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  },
  menus: {
    type: Array,
    required: true
  },
  collapsed: {
    type: Boolean,
    required: false,
    default: false
  },
  device: {
    type: String,
    required: false,
    default: 'desktop'
  }
}
