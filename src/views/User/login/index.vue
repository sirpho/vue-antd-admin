<template>
  <div class="login-container">
    <a-row>
      <a-col :xs="0" :md="0" :sm="12" :lg="14" :xl="16"/>
      <a-col :xs="24" :sm="24" :md="12" :lg="10" :xl="6">
        <div class="login-container-form">
          <div class="login-container-hello">hello!</div>
          <div class="login-container-title">欢迎来到 {{ title }}</div>
          <a-form :model="form" @submit="handleSubmit" @submit.prevent>
            <a-form-item>
              <a-input v-model:value="form.userName" placeholder="userName">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                v-model:value="form.password"
                type="password"
                placeholder="Password"
              >
                <template v-slot:prefix>
                  <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                :disabled="form.userName === '' || form.password === ''"
              >
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>
    <div class="login-container-tips">
      基于vue{{ dependencies['vue'] }}
      + ant-design-vue
      {{ dependencies['ant-design-vue'] }}开发
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

interface formState {
  userName: string;
  password: string;
}

interface loginState {
  redirect: any;
  form: formState;
  dependencies: object;
  devDependencies: object;
}

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { pkg } = __APP_INFO__;
    const state: loginState = reactive({
      redirect: undefined,
      form: {
        userName: '',
        password: ''
      },
      dependencies: pkg.dependencies,
      devDependencies: pkg.devDependencies,
    })
    onMounted(() => {
      state.form.userName = 'admin'
      state.form.password = '123456'
    })
    watch(
      () => route.fullPath,
      () => {
        state.redirect = (route.query && route.query.redirect) || '/'
      },
      {
        deep: true,
        immediate: true
      }
    )
    const handleRoute = () => {
      return state.redirect === '/exception/404' || state.redirect === '/exception/403' ? '/' : state.redirect
    }
    const handleSubmit = async () => {
      const response: any = await store.dispatch('user/login', state.form)
      if (response) {
        await router.push(handleRoute())
      }
    }
    return {
      logo: store.getters['settings/logo'],
      title: store.getters['settings/title'],
      ...toRefs(state),
      handleSubmit
    }
  }
})
</script>

<style lang="less">
@import "./style";
</style>
