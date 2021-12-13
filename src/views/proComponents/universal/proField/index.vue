<template>
  <g-pro-page-wrapper>
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
        <g-pro-field text="" mode="read" />
      </a-descriptions-item>
      <a-descriptions-item label="头像">
        <g-pro-field
          text="https://avatars2.githubusercontent.com/u/8186664?s=60&v=4"
          mode="read"
          valueType="avatar"
        />
      </a-descriptions-item>
      <a-descriptions-item label="文本">
        <g-pro-field
          text="这是一段文本"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="图片">
        <g-pro-field
          text="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          valueType="image"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="金额">
        <g-pro-field
          text="100"
          valueType="money"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="颜色">
        <g-pro-field
          text="#1099aa"
          valueType="color"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="数字">
        <g-pro-field
          text="19897979797979"
          valueType="digit"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="秒格式化">
        <g-pro-field
          text="2000000"
          valueType="second"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="百分比">
        <g-pro-field
          text="100"
          valueType="percent"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="评分">
        <g-pro-field
          text="3.5"
          valueType="rate"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="选择框">
        <g-pro-field
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
      <a-descriptions-item label="多选">
        <g-pro-field
          :text="['open', 'closed']"
          :mode="state"
          valueType="checkbox"
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
      <a-descriptions-item label="多选 labelInValue">
        <g-pro-field
          :text="[
            {
              value: 'open1',
              label: '打开',
            },
            {
              value: 'closed2',
              label: '关闭',
            },
          ]"
          :mode="state"
          valueType="checkbox"
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
      <a-descriptions-item label="单选">
        <g-pro-field
          text="open"
          :mode="state"
          valueType="radio"
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
      <a-descriptions-item label="单选按钮">
        <g-pro-field
          text="open"
          :mode="state"
          valueType="radioButton"
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
        <g-pro-field
          text="open"
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
      <a-descriptions-item label="级联选择框">
        <g-pro-field
          :text="['zhejiang', 'hangzhou', 'xihu']"
          valueType="cascader"
          :mode="state"
          :request="async () => [
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [
                {
                  value: 'hangzhou',
                  label: 'Hangzhou',
                  children: [
                    {
                      value: 'xihu',
                      label: 'West Lake',
                    },
                  ],
                },
              ],
            },
            {
              value: 'jiangsu',
              label: 'Jiangsu',
              children: [
                {
                  value: 'nanjing',
                  label: 'Nanjing',
                  children: [
                    {
                      value: 'zhonghuamen',
                      label: 'Zhong Hua Men',
                    },
                  ],
                },
              ],
            },
          ]"
        />
      </a-descriptions-item>
      <a-descriptions-item label="进度条">
        <g-pro-field
          text="40"
          valueType="progress"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="百分比">
        <a-space>
          <g-pro-field
            :text="10"
            :valueType="{
              type: 'percent',
              showSymbol: true,
              showColor: true,
            }"
            mode="read"
          />
          <g-pro-field
            :text="0"
            :valueType="{
              type: 'percent',
              showSymbol: true,
              showColor: true,
            }"
            mode="read"
          />
          <g-pro-field
            :text="-10"
            :valueType="{
              type: 'percent',
              showSymbol: true,
              showColor: true,
            }"
            mode="read"
          />
        </a-space>
      </a-descriptions-item>
      <a-descriptions-item label="日期时间">
        <g-pro-field
          :text="dateTime"
          valueType="dateTime"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="相对于当前时间">
        <a-space>
          <g-pro-field
            :text="dateTime"
            valueType="fromNow"
            :mode="state"
            :plain="plain"
          />
          <g-pro-field
            :text="moment('2013-11-16 12:50:26').valueOf()"
            valueType="fromNow"
            :mode="state"
            :plain="plain"
          />
        </a-space>
      </a-descriptions-item>
      <a-descriptions-item label="日期">
        <g-pro-field
          :text="dateTime"
          valueType="date"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="日期区间">
        <g-pro-field
          :text="[
            moment('2019-11-16 12:50:26').add(-1, 'd').valueOf(),
            moment('2019-11-16 12:50:26').valueOf(),
          ]"
          valueType="dateRange"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="日期时间区间">
        <g-pro-field
          :text="[
            moment('2019-11-16 12:50:26').add(-1, 'd').valueOf(),
            moment('2019-11-16 12:50:26').valueOf(),
          ]"
          valueType="dateTimeRange"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="时间">
        <g-pro-field
          :text="moment('2019-11-16 12:50:26').valueOf()"
          valueType="time"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <!--<a-descriptions-item label="时间区间">-->
      <!--  <g-pro-field-->
      <!--    :text="[-->
      <!--      moment('2019-11-16 12:50:26').add(-1, 'd').valueOf(),-->
      <!--      moment('2019-11-16 12:50:26').valueOf(),-->
      <!--    ]"-->
      <!--    valueType="timeRange"-->
      <!--    :mode="state"-->
      <!--    :plain="plain"-->
      <!--  />-->
      <!--</a-descriptions-item>-->
      <a-descriptions-item label="代码块">
        <g-pro-field
          :text="`
            yarn run v1.22.0
            $ eslint --format=pretty ./packages
            Done in 9.70s.
          `"
          valueType="code"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
      <a-descriptions-item label="代码块">
        <g-pro-field
          :text="jsonCode"
          valueType="jsonCode"
          :mode="state"
          :plain="plain"
        />
      </a-descriptions-item>
    </a-descriptions>
  </g-pro-page-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import moment from 'moment'

const state = ref('read')
const plain = ref(false)
const dateTime = moment('2019-11-16 12:50:26').valueOf()
const jsonCode = `{
  "compilerOptions": {
    "target": "esnext",
    "moduleResolution": "node",
    "jsx": "preserve",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "suppressImplicitAnyIndexErrors": true,
    "declaration": true,
    "skipLibCheck": true
  },
  "include": ["**/src", "**/docs", "scripts", "**/demo", ".eslintrc.js"]
}
`
const handlechange = (e) => {
  console.log(e)
}
</script>

<style lang="less" module>

</style>
