<template>
  <a-typography id="search-api" style="margin-top: 15px">
    <a-typography-title
      style="margin-top: 12px"
      :level="3"
      :style="{color: '#454d64'}"
    >
      Search 搜索表单（type为columns时，表格columns添加searchConfig-参数为表单data通用配置）
    </a-typography-title>
  </a-typography>
  <g-pro-table
    style="margin-top: 15px"
    :showIndex="false"
    :showPagination="false"
    :options="false"
    size="default"
    :columns="searchConfig"
    :dataSource="searchTableData"
    :row-key="(record) => record.attributes"
  />
  <a-typography-title
    id="search-type-dataSouce"
    style="margin-top: 15px"
    :level="4"
    :style="{color: '#454d64'}"
  >
    Pro Table - Search type: dataSouce示例：
  </a-typography-title>
  <a-typography-paragraph style="margin-top: 15px" copyable class="gx-code">
    <pre>{{ searchDataCode }}</pre>
  </a-typography-paragraph>
  <a-typography-title
    id="search-type-slots"
    style="margin-top: 15px"
    :level="4"
    :style="{color: '#454d64'}"
  >
    Pro Table - Search type: slots示例：
  </a-typography-title>
  <a-typography-paragraph style="margin-top: 15px" copyable class="gx-code">
    <pre>{{ searchSlotsCode }}</pre>
  </a-typography-paragraph>
  <a-typography-title
    id="search-type-columns"
    style="margin-top: 15px"
    :level="4"
    :style="{color: '#454d64'}"
  >
    Pro Table - Search type: columns示例：
  </a-typography-title>
  <a-typography-paragraph style="margin-top: 15px" copyable class="gx-code">
    <pre>{{ searchColumnsCode }}</pre>
  </a-typography-paragraph>
  <a-typography id="searchData-api" style="margin-top: 15px">
    <a-typography-title
      style="margin-top: 12px"
      :level="3"
      :style="{color: '#454d64'}"
    >
      Pro Table - Search - data 通用配置
    </a-typography-title>
  </a-typography>
  <g-pro-table
    :showIndex="false"
    :showPagination="false"
    :options="false"
    size="default"
    :columns="searchDataConfig"
    :dataSource="searchCommonData"
    :row-key="(record) => record.attributes"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import columns from '../utils/columns'
import config from '../utils/config'

export default defineComponent({
  setup() {
    const state = reactive({
      searchConfig: columns.searchConfig,
      searchDataConfig: columns.searchDataConfig,
      searchTableData: config.searchTableData,
      searchCommonData: config.searchCommonData,
      searchDataCode: config.searchDataCode,
      searchSlotsCode: config.searchSlotsCode,
      searchColumnsCode: config.searchColumnsCode,
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped>

</style>
