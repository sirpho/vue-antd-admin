<template>
  <template v-if="device === 'desktop'">
    <div style="min-width: 208px;">
      <div style="padding-right: 8px">
        <div style="display: flex;justify-content: flex-end;">
          <a-dropdown>
          <span class="wd-pro-dropdown wd-pro-dropdown-action">
            <a-avatar size="small" :src="avatar" class="wd-pro-global-header-account-avatar" />
            <span class="wd-pro-global-header-account-name">{{ username }}</span>
          </span>
            <template #overlay>
              <a-menu>
                <a-menu-item key="3" @click="logout">
                  <a href="javascript:">
                    <LogoutOutlined />
                    <span>退出登录</span>
                  </a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div style="display: flex;justify-content: flex-end;">
      <a-dropdown>
        <span class="wd-pro-dropdown wd-pro-dropdown-action">
          <a-avatar size="small" :src="avatar" class="wd-pro-global-header-account-avatar" />
          <span class="wd-pro-global-header-account-name">{{ username }}</span>
        </span>
        <template #overlay>
          <a-menu>
            <a-menu-item key="3" @click="logout">
              <a href="javascript:">
                <LogoutOutlined />
                <span>退出登录</span>
              </a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { LogoutOutlined } from '@ant-design/icons-vue'
import config from '/config/config'

export default defineComponent({
  components: { LogoutOutlined },
  props: {
    device: {
      type: String,
      required: false,
      default: 'desktop'
    }
  },
  setup() {
    const { recordRoute } = config.defaultSettings
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const logout = async () => {
      await store.dispatch('user/logout')
      if (recordRoute) {
        const fullPath = route.fullPath
        router.push(`/user/login?redirect=${fullPath}`)
      } else {
        router.push('/user/login')
      }
    }
    return {
      avatar: computed(() => store.getters['user/avatar']),
      username: computed(() => store.getters['user/username']),
      logout
    }
  }
})
</script>
