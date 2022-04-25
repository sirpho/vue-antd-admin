<template>
  <g-pro-form-login
    :model="userForm"
    :formRef="(e) => (formRef = e)"
    :rules="userRules"
    title="gx-admin"
    subTitle="全球最大同性交友网站"
  >
    <template #actions>
      <a-space>
        其他登录方式
        <AlipayCircleOutlined :style="iconStyles" />
        <TaobaoCircleOutlined :style="iconStyles" />
        <WeiboCircleOutlined :style="iconStyles" />
      </a-space>
    </template>
    <g-pro-form-text
      name="username"
      :fieldProps="{ size: 'large', prefix: userOutlined }"
      placeholder="用户名: admin or user"
    />
    <g-pro-form-password
      name="password"
      :fieldProps="{ size: 'large', prefix: lockOutlined }"
      placeholder="密码: ant.design"
    />
  </g-pro-form-login>
</template>

<script setup lang="ts">
import { reactive, ref, h } from 'vue'
import {
  UserOutlined,
  LockOutlined,
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined
} from '@ant-design/icons-vue'

const userOutlined = h(UserOutlined, {
  class: 'prefixIcon'
})

const lockOutlined = h(LockOutlined, {
  class: 'prefixIcon'
})

const iconStyles = {
  marginLeft: '16px',
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '24px',
  verticalAlign: 'middle',
  cursor: 'pointer'
}

const formRef = ref()

const userForm = reactive({
  username: '',
  password: ''
})

const userRules = reactive({
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }]
})
</script>
