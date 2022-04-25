<template>
  <g-pro-page-wrapper>
    <g-doc>
      <a-typography id="g-pro-form">
        <a-typography-title :level="2" :style="{ color: '#454d64' }">
          ProForm 高级表单
        </a-typography-title>
        <p style="font-size: 15px">
          ProForm 在原来的 Form
          的基础上增加一些语法糖和更多的布局设置，帮助我们快速的开发一个表单。同时添加一些默认行为，让我们的表单默认好用。
        </p>
        <p style="font-size: 15px">
          分步表单，Modal 表单，Drawer 表单，查询表单，轻量筛选等多种 layout
          可以覆盖大部分的使用场景，脱离复杂而且繁琐的表单布局工作，更少的代码完成更多的功能。
        </p>
        <p>
          ProForm 没有黑科技，只是 antd 的 Form 的封装，如果要使用自定义的组件可以用 Form.Item
          包裹后使用，支持混用。（
          <a-typography-text type="danger" code style="font-size: 14px">ProForm</a-typography-text>
          的
          <a-typography-text type="danger" code style="font-size: 14px">mode</a-typography-text>
          属性值以及表单项的
          <a-typography-text type="danger" code style="font-size: 14px"> name </a-typography-text>
          值必须要传，否则报错！）
        </p>
        <a-typography-paragraph copyable class="gx-code-block">
          <pre>{{ proFormCode }}</pre>
        </a-typography-paragraph>
      </a-typography>
      <ProFormComponent />
      <ProFormBasic />
      <ProFormLayout />
      <ProFormDependency />
      <ProFormMoney />
    </g-doc>
  </g-pro-page-wrapper>
</template>

<script setup lang="ts">
import ProFormComponent from './components/ProFormComponent/index.vue'
import ProFormBasic from './components/ProFormBasic/index.vue'
import ProFormMoney from './components/ProFormMoney/index.vue'
import ProFormLayout from './components/ProFormLayout/index.vue'
import ProFormDependency from './components/ProFormDependency/index.vue'

import { proFormCode } from './utils/config'

// const formState = reactive({
//   name: '',
//   company: '',
//   phone: '',
//   email: '',
//   address: '',
//   date: '',
//   dateRange: '',
// })
</script>
