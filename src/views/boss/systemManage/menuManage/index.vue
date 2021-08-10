<template>
  <w-page-wrapper>
    <w-pro-table
      row-key="menuId"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      :loading="loading"
    >
      <template #menuType="{ text }">
        {{ menuTypeList[text] || '-' }}
      </template>
      <template #visible="{ text }">
        {{ text === '0' ? '显示' : '隐藏' }}
      </template>
    </w-pro-table>
  </w-page-wrapper>
</template>
<script lang="ts">
import { defineComponent ,reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { getRouterList } from '/@/services/router'
import { treeData } from '/@/utils/util'
import columns from './utils/columns'

export default defineComponent({
  setup() {
    const { proxy }: any = getCurrentInstance()
    const state = reactive({
      tableData: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      total: 0,
      loading: false,
      columns: columns.index,
      menuTypeList: {
        M: '目录',
        F: '按钮',
        C: '菜单'
      }
    })
    const getTableData = async () => {
      const response = await getRouterList()
      if (response && response.code === 200) {
        const tableData = treeData(response.data || [], 'menuId')
        state.tableData = tableData
        state.total = response.total || 0
      } else {
        proxy.$message.error((response && response.msg) || '系统错误，请稍后再试！')
      }
    }
    onMounted(() => {
      getTableData()
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
