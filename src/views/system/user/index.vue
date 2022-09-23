<template>
  <g-pro-page-container>
    <g-pro-table
      row-key="id"
      :scroll="{ x: 'max-content', y: tableHeight }"
      align="center"
      :search="{
        onCollapse: updateTableHeight
      }"
      showIndex
      :actionRef="(info) => (tableRef = info)"
      :formRef="(info) => (formRef = info)"
      :columns="columns"
      :request="(params, sort, filter) => getTableList(params, sort, filter)"
    >
      <template #toolBarBtn>
        <a-button key="export" size="small" type="primary" @click="handleExport">
          <cloud-download-outlined />
          导出
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <a-space v-if="column.dataIndex === 'action'">
          <a-button v-if="record.status === '启用'" danger @click="disableConfirm(record)"
            >禁用</a-button
          >
          <a-button v-else @click="enableConfirm(record)">启用</a-button>
        </a-space>
      </template>
    </g-pro-table>
  </g-pro-page-container>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, createVNode } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
import { getUserList, exportUserList, enableUser, disableUser } from '@/services/system/user'
import columns from './utils/columns'
import { useTableHeight } from '@/hooks/web/useTableHeight'

export default defineComponent({
  setup() {
    const tableRef = ref()
    const formRef = ref()
    const operation = ref()
    const [tableHeight, updateTableHeight] = useTableHeight()
    const state = reactive({
      columns: columns.index,
      tableData: []
    })

    /**
     * 获取表格数据
     * @param params
     */
    const getTableList = async (params) => {
      const response = await getUserList({
        ...params,
        limit: params.pageSize,
        page: params.pageNum
      })
      state.tableData = response?.data?.list || []
      return {
        data: response?.data?.list || [],
        success: response && response.code === 0,
        total: response.data.totalCount,
        current: response.data.currPage
      }
    }

    /**
     * 启用确认
     * @param record
     */
    const enableConfirm = (record) => {
      Modal.confirm({
        title: '确定要启用吗?',
        icon: createVNode(ExclamationCircleFilled),
        okText: '确定',
        cancelText: '取消',
        class: 'gx-pro-confirm-warning',
        onOk() {
          handleEnable(record)
        }
      })
    }
    /**
     * 启用操作
     * @param record
     */
    const handleEnable = async (record) => {
      tableRef.value.loadingOperation(true)
      const response: any = await enableUser([record.id])
      if (response) {
        message.success('操作成功！')
        await tableRef.value.reload()
      }
      tableRef.value.loadingOperation(false)
    }

    /**
     * 禁用确认
     * @param record
     */
    const disableConfirm = (record) => {
      Modal.confirm({
        title: '确定要禁用吗?',
        icon: createVNode(ExclamationCircleFilled),
        okText: '确定',
        cancelText: '取消',
        class: 'gx-pro-confirm-delete',
        onOk() {
          handleDisable(record)
        }
      })
    }

    /**
     * 禁用操作
     * @param record
     */
    const handleDisable = async (record) => {
      tableRef.value.loadingOperation(true)
      const response: any = await disableUser([record.id])
      if (response) {
        message.success('操作成功！')
        await tableRef.value.reload()
      }
      tableRef.value.loadingOperation(false)
    }

    /**
     * 导出
     */
    const handleExport = () => {
      const { formParams } = tableRef.value
      exportUserList(formParams)
    }
    return {
      ...toRefs(state),
      tableRef,
      formRef,
      operation,
      getTableList,
      tableHeight,
      updateTableHeight,
      handleExport,
      enableConfirm,
      disableConfirm
    }
  }
})
</script>
