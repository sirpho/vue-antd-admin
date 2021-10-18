<template>
  <a-typography style="margin-top: 16px" id="proCardTabPane">
    <a-typography-title :level="4" :style="{color: '#454d64'}">
      ProCard.TabPane
    </a-typography-title>
  </a-typography>
  <w-pro-table
    :showIndex="false"
    :showPagination="false"
    :options="false"
    size="default"
    :columns="parameter"
    :dataSource="proCardTabPaneData"
    :row-key="(record) => record.attributes"
  >
    <template #headerTitle>
      支持&nbsp;&nbsp;<a target="_blank" href="https://2x.antdv.com/components/tabs-cn#API">Tab</a>&nbsp;&nbsp;的所有属性。
    </template>
  </w-pro-table>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { parameter } from '../utils/columns'
import { proCardTabPaneData } from '../utils/config'

export default defineComponent({
  setup() {
    const state = reactive({
      parameter,
      proCardTabPaneData
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
