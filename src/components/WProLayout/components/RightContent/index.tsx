import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { LogoutOutlined } from '@ant-design/icons-vue'
import config from '/config/config'
import HeaderSearch from './HeaderSearch'
import AvatarDropdown from './AvatarDropdown'
import NoticeIcon from '../NoticeIcon'

export default defineComponent({
  components: { LogoutOutlined },
  props: {
    isMobile: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(_) {
    const { recordRoute } = config.defaultSettings
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const avatar = computed(() => store.getters['user/avatar'])
    const username = computed(() => store.getters['user/username'])
    const logout = async () => {
      await store.dispatch('user/logout')
      if (recordRoute) {
        const fullPath = route.fullPath
        router.push(`/user/login?redirect=${fullPath}`)
      } else {
        router.push('/user/login')
      }
    }

    return () => (
      <a-space>
        <HeaderSearch
          className={`wd-pro-right-content-action wd-pro-header-search`}
          placeholder="站内搜索"
          defaultValue="umi ui"
          options={[
            {
              label: <a>umi ui</a>,
              value: 'umi ui'
            },
            {
              label: <a>Ant Design</a>,
              value: 'Ant Design'
            },
            {
              label: <a>Pro Table</a>,
              value: 'Pro Table'
            },
            {
              label: <a>Pro Layout</a>,
              value: 'Pro Layout'
            }
          ]}
        />
        <NoticeIcon />
        <AvatarDropdown
          avatar={avatar.value}
          username={username.value}
          onLogout={logout}
        />
      </a-space>
    )
  }
})
