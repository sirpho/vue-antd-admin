<template>
  <div :class="$style['login-container']">
    <div :class="$style.content">
      <LoginContainer style="margin-top: 40px" :rules="userRules" :logo="Logo" title="GX Pro Admin">
        <template #subTitle>
          <p>GX Pro Admin 是一套基于</p>
          vue（{{ state.dependencies['vue'] }}） + ant-design-vue（{{
            state.dependencies['ant-design-vue']
          }}） 开发的一套后台系统
        </template>
        <a-form>
          <a-form-item v-bind="validateInfos.userName">
            <a-input
              name="userName"
              size="large"
              v-model:value="userForm.userName"
              placeholder="用户名: admin"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item v-bind="validateInfos.password">
            <a-input-password
              name="password"
              size="large"
              v-model:value="userForm.password"
              placeholder="密码: gx.design"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item style="margin-bottom: 24px">
            <a-checkbox noStyle name="autoLogin" v-model:checked="userForm.autoLogin">
              自动登录
            </a-checkbox>
            <a style="float: right">忘记密码</a>
          </a-form-item>
          <a-form-item>
            <a-button htmlType="submit" type="primary" block size="large" @click="handleSubmit"
              >登录</a-button
            >
          </a-form-item>
        </a-form>
      </LoginContainer>
    </div>
    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@gx-vuex'
import { useRoute, useRouter } from 'vue-router'
import { Form } from 'ant-design-vue'
import { Props, validateOptions } from 'ant-design-vue/lib/form/useForm'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { GlobalFooter } from '@gx-design/ProLayout'
import Logo from '/@/assets/logo.png'
import LoginContainer from './LoginContainer'
import { reactive } from 'vue'

interface UserState {
  userName?: string
  password?: string
  autoLogin?: boolean
}

interface loginState {
  redirect: string
  dependencies: RecordType
  devDependencies: RecordType
}

const { pkg } = __APP_INFO__

const iconStyles = {
  marginLeft: '16px',
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '24px',
  verticalAlign: 'middle',
  cursor: 'pointer'
}

const useForm = Form.useForm

const store = useStore()
const route = useRoute()
const router = useRouter()

const userForm = reactive({
  userName: '',
  password: '',
  autoLogin: true
} as UserState)

const userRules = reactive({
  userName: [{ required: true, message: '用户名是必填项！' }],
  password: [{ required: true, message: '密码是必填项！' }]
})

const state: loginState = reactive({
  redirect: undefined,
  dependencies: pkg.dependencies,
  devDependencies: pkg.devDependencies
})

const logo = computed(() => store.settings.logo)
const title = computed(() => store.settings.title)

const {
  validate,
  validateInfos
}: {
  resetFields: (newValues?: Props) => void
  validate: <T = any>(names?: string | string[], option?: validateOptions) => Promise<T>
  validateInfos: UserState
} = useForm(userForm, userRules)

watch(
  () => route.fullPath,
  () => {
    state.redirect = (route.query?.redirect as string) || '/'
  },
  {
    deep: true,
    immediate: true
  }
)
const handleRoute = () => {
  return state.redirect === '/exception/404' || state.redirect === '/exception/403'
    ? '/'
    : state.redirect
}

const handleSubmit = () => {
  validate()
    .then(async (value) => {
      const response: any = await store.user.userLogin({ ...value })
      if (response) {
        await router.push(handleRoute())
      }
    })
    .catch((_) => {})
}
</script>

<style lang="less" module>
@import './style';
</style>
