<template>
  <g-page-wrapper>
    <g-pro-table
      headerTitle="查询表格"
      row-key="key"
      align="center"
      :showIndex="false"
      :search="{ type: 'columns' }"
      :actionRef="info => tableRef = info"
      :columns="columns"
      :request="(params, sort, filter) => getTableList(params, sort, filter)"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
    >
      <template #toolBarBtn>
        <a-button key="button" type="primary" @click="handleTableAdd">
          <PlusOutlined />
          新建
        </a-button>
      </template>
      <template #nameTitle>
        规则名称
        <a-tooltip title="规则名称是唯一的 key">
          <InfoCircleOutlined />
        </a-tooltip>
      </template>
      <template #name="{ record }">
        <a v-if="record.name">{{ record.name }}</a>
        <template v-else>-</template>
      </template>
      <template #callNo="{ record }">
        {{ record.callNo > 0 ? `${record.callNo}万` : record.callNo }}
      </template>
      <template #status="{ record }">
        <a-badge v-if="record.status === '0'" status="default" text="关闭" />
        <a-badge v-if="record.status === '1'" status="processing" text="运行中" />
        <a-badge v-if="record.status === '2'" status="success" text="已上线" />
        <a-badge v-if="record.status === '3'" status="error" text="异常" />
      </template>
      <template #action="{ record }">
        <a key="config" style="margin-right: 15px;" @click="updateTableRule(record)">配置</a>
        <a key="config" style="margin-right: 15px;" @click="removeTableConfirm(record)">删除</a>
        <a key="subscribeAlert" href="https://procomponents.ant.design/" target="_blank">订阅警报</a>
      </template>
    </g-pro-table>
    <OperationModal ref="operation" @handleOk="tableRef.reload()" />
  </g-page-wrapper>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, ref, toRefs, createVNode } from 'vue'
import { InfoCircleOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'
import { rule, removeRule } from '/@/services/list/table'
import { handleSelectPage } from '/@/utils/util'
import OperationModal from './components/OperationModal.vue'
import columns from './utils/columns'

export default defineComponent({
  components: {
    PlusOutlined,
    OperationModal,
    InfoCircleOutlined
  },
  setup() {
    const { proxy }: any = getCurrentInstance()
    const tableRef = ref()
    const operation = ref()
    const state = reactive({
      columns: cloneDeep(columns.index),
      tableData: [],
      selectedRowKeys: [],
      selectedRowItems: []
    })
    const getTableList = async (params, sorter: any = {}) => {
      const { order, columnKey } = sorter
      let sortOrder = ''
      let sortField = ''
      if (order) {
        sortOrder = order
        sortField = columnKey
      }
      const response = await rule({
        ...params,
        sortOrder,
        sortField
      })
      state.tableData = cloneDeep(response?.rows || [])
      return {
        data: cloneDeep(response?.rows || []),
        success: response && response.code === 200,
        total: response.total,
        msg: response.msg
      }
    }
    const onSelectChange = (keys, items) => {
      state.selectedRowKeys = keys
      state.selectedRowItems = handleSelectPage({
        rowKey: 'key',
        oldSelectItems: cloneDeep(state.selectedRowItems),
        selectItems: items,
        tableData: state.tableData
      })
    }
    const handleTableAdd = () => {
      operation.value?.open()
    }
    const updateTableRule = async (record) => {
      operation.value?.edit(record.key)
    }
    const removeTableConfirm = (record) => {
      proxy.$antdconfirm({
        title: '确定要删除吗?',
        icon: createVNode(ExclamationCircleOutlined),
        okText: '确定',
        cancelText: '取消',
        class: 'gx-pro-confirm-delete',
        onOk() {
          removeTableRule(record)
        }
      })
    }
    const removeTableRule = async (record) => {
      tableRef.value.loadingOperation(true)
      const response: any = await removeRule({
        key: record.key
      })
      if (response) {
        proxy.$message.success('操作成功！')
        await tableRef.value.reload({ removeTotal: 1 })
      }
      tableRef.value.loadingOperation(false)
    }
    return {
      ...toRefs(state),
      tableRef,
      operation,
      getTableList,
      onSelectChange,
      handleTableAdd,
      updateTableRule,
      removeTableConfirm
    }
  }
})
</script>

<style scoped>

</style>
