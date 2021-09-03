import { CustomRender, WithFalse } from '@wd-pro/pro-layout'

export default {
  affixTabs: {
    type: Array as PropType<WithFalse<string[]>>,
    default: () => undefined
  },
  logo: {
    type: [ Object, String, Function ] as PropType<CustomRender>,
    default: () => undefined
  }
}
