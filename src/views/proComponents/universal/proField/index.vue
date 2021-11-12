<template>
  <w-page-wrapper>
    <a-space>
      <a-radio-group v-model:value="state">
        <a-radio value="read">只读</a-radio>
        <a-radio value="edit">编辑</a-radio>
      </a-radio-group>
      简约模式
      <a-switch v-model:checked="plain" />
    </a-space>
    <a-descriptions style="margin-top: 15px" :column="2">
      <a-descriptions-item label="空字符串">
        <w-pro-field text="" mode="read" />
      </a-descriptions-item>
      <a-descriptions-item label="头像">
        <w-pro-field
          text="https://avatars2.githubusercontent.com/u/8186664?s=60&v=4"
          mode="read"
          valueType="avatar"
        />
      </a-descriptions-item>
      <a-descriptions-item label="文本">
        <w-pro-field
          text="这是一段文本"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="图片">
        <w-pro-field
          text="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          valueType="image"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="金额">
        <w-pro-field
          text="100"
          valueType="money"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="颜色">
        <w-pro-field
          text="#1099aa"
          valueType="color"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="数字">
        <w-pro-field
          text="19897979797979"
          valueType="digit"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="秒格式化">
        <w-pro-field
          text="2000000"
          valueType="second"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="百分比">
        <w-pro-field
          text="100"
          valueType="percent"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="评分">
        <w-pro-field
          text="3.5"
          valueType="rate"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="选择框">
        <w-pro-field
          text="open"
          :mode="state"
          :valueEnum="{
            all: { text: '全部', disabled: true, status: 'Default' },
            open: {
              text: '未解决',
              status: 'Error',
            },
            closed: {
              text: '已解决',
              status: 'Success',
            },
            processing: {
              text: '解决中',
              status: 'Processing',
            },
          }"
        />
      </a-descriptions-item>
      <a-descriptions-item label="远程选择框">
        <w-pro-field
          text="open"
          light
          valueType="select"
          :mode="state"
          :request="async () => [
            { label: '全部', value: 'all' },
            { label: '未解决', value: 'open' },
            { label: '已解决', value: 'closed' },
            { label: '解决中', value: 'processing' },
            {
              label: '特殊选项',
              value: 'optGroup',
              optionType: 'optGroup',
              options: [
                { label: '不解决', value: 'no' },
                { label: '已废弃', value: 'clear' },
              ],
            },
          ]"
        />
      </a-descriptions-item>
    </a-descriptions>
  </w-page-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const state = ref('read')
const plain = ref(false)
const handlechange = (e) => {
  console.log(e)
}
</script>

<style lang="less" module>

</style>
