<template>
  <a-typography style="margin-top: 15px" id="g-pro-form-layout">
    <a-typography-title :level="2" :style="{ color: '#454d64' }"
      >何时使用 ProForm？</a-typography-title
    >
    <a-typography-paragraph>
      当你想快速实现一个表单但不想花太多时间去布局时 ProForm 是最好的选择。
    </a-typography-paragraph>
    <a-typography-paragraph>
      ProForm 是基于 antd Form 的可降级封装，与 antd
      功能完全对齐，但是在其之上还增加一些预设行为和多种布局。这些布局之间可以无缝切换，并且拥有公共的
      API。
    </a-typography-paragraph>
  </a-typography>
  <div class="gx-markdown-demo">
    <g-pro-card>
      <g-pro-form-radio-group
        radioType="button"
        :fieldProps="{
          value: type,
          onChange: (val) => setType(val)
        }"
        :options="[
          'LightFilter',
          'ProForm',
          'ModalForm',
          'DrawerForm',
          'QueryFilter',
          'StepsForm',
          'LoginForm'
        ]"
      />
      <LightFilter v-if="type === 'LightFilter'" />
      <ProForm v-if="type === 'ProForm'" />
      <ModalForm v-if="type === 'ModalForm'" />
      <LoginForm v-if="type === 'LoginForm'" />
    </g-pro-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProForm from './ProForm.vue'
import LightFilter from './LightFilter.vue'
import ModalForm from './ModalForm.vue'
import LoginForm from './LoginForm.vue'

const type = ref('ProForm')

const setType = (val) => {
  type.value = val
}
</script>
