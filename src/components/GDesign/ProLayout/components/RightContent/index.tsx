import { computed, defineComponent, createVNode } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Modal, Space } from 'ant-design-vue'
import { LogoutOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import config from '/config/config'
import { useStore } from '@gx-vuex'
import { globalHeaderProps } from '../GlobalHeader/props'
import NoticeIcon from '../NoticeIcon'
import AvatarDropdown from './AvatarDropdown'
import { useRouteContext } from '../../RouteContext'

export default defineComponent({
  components: { LogoutOutlined },
  props: {
    theme: globalHeaderProps.theme,
    extra: globalHeaderProps.extraRightDropdownRender
  },
  setup(props) {
    const { recordRoute } = config.defaultSettings

    const context = useRouteContext()

    const baseClassName = context.getPrefixCls({
      suffixCls: 'header-right',
      isPor: true
    })

    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const userInfo = computed(() => store.user.userInfo)

    const logout = () => {
      Modal.confirm({
        title: '温馨提醒',
        icon: createVNode(ExclamationCircleOutlined),
        content: '是否确认退出系统?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          return new Promise((resolve) => {
            setTimeout(resolve, 200)
            store.user.userLogout().then(() => {
              if (recordRoute) {
                const fullPath = route.fullPath
                router.push(`/user/login?redirect=${fullPath}`)
              } else {
                router.push({ path: '/user/login' })
              }
            })
          })
        },
        onCancel() {}
      })
    }

    return () => (
      <Space class={[baseClassName, props.theme]}>
        <NoticeIcon />
        <AvatarDropdown userName={userInfo.value.uname} onLogout={logout} {...props} />
      </Space>
    )
  }
})
