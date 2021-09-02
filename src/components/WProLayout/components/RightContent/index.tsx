import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { LogoutOutlined } from '@ant-design/icons-vue'
import config from '/config/config'

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
      <a-dropdown
        overlay={
          <a-menu>
            <a-menu-item key="3" onClick={logout}>
              <a href="javascript:">
                <LogoutOutlined />
                <span>退出登录</span>
              </a>
            </a-menu-item>
          </a-menu>
        }
      >
        <span class="wd-pro-dropdown wd-pro-dropdown-action">
          <a-avatar
            src={avatar.value}
            size="small"
            class="wd-pro-global-header-account-avatar"
          />
          <span class="wd-pro-global-header-account-name">{username.value}</span>
        </span>
      </a-dropdown>
    )
  }
})
