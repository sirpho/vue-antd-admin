<template>
  <w-page-wrapper>
    <w-pro-table
      titleTip
      draggabled
      align="center"
      :actionRef="info => tableRef = info"
      :search="{
        type: 'slots',
        showSearch: true
      }"
      :params="tableParameters"
      :columns="columns"
      :row-key="(record) => record.uuid"
      :request="(params, sort, filter) => getTableData(params, sort, filter)"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :scroll="{ x: 1850 }"
      @reset="onReset"
      @searchReset="onSearchReset"
    >
      <template #headerTitle>
        <div>高级列表</div>
      </template>
      <template #toolBarBtn>
        <a-button key="button" type="primary">
          新建
        </a-button>
        <a-button v-if="selectedRowKeys.length > 0" danger key="button" type="primary">
          删除
        </a-button>
        <a-dropdown :trigger="[ 'click' ]">
          <template #overlay>
            <a-menu @click="(e) => batchOperation(e)">
              <a-menu-item key="0">1st menu item</a-menu-item>
              <a-menu-item key="1">2nd menu item</a-menu-item>
              <a-menu-divider />
              <a-menu-item key="3">3rd menu item</a-menu-item>
            </a-menu>
          </template>
          <a-button key="button">
            批量操作
          </a-button>
        </a-dropdown>
      </template>
      <template #search>
        <w-input-search
          v-model:searchValue="tableParameters.title"
          :actionRef="info => inputSearchRef = info"
          allow-clear
          placeholder="请输入标题"
          style="width: 100%"
        >
          <template #enterButton>
            <a-button>
              <SearchOutlined />
            </a-button>
          </template>
        </w-input-search>
        <a-select
          v-model:value="tableParameters.source"
          placeholder="请选择来源"
          allow-clear
          style="width: 100%"
        >
          <a-select-option value="jack">
            Jack
          </a-select-option>
          <a-select-option value="lucy">
            Lucy
          </a-select-option>
          <a-select-option value="Yiminghe">
            yiminghe
          </a-select-option>
        </a-select>
      </template>
      <template #FullName>
        FullName
      </template>
      <template #name="{ record  }">
        这是高级列表的FullName的字段（测试溢出展示）：{{ record.title }}
      </template>
      <template #action>
        <a>这是高级列表的action的字段（测试溢出展示并且可复制）</a>
      </template>
    </w-pro-table>
    <ProTableApi />
    <ProTableSearch />
    <ProTableColums />
    <w-back-top />
  </w-page-wrapper>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { getList } from '/@/services/table'
import { deepCopy, handleSelectPage } from '/@/utils/util'
import ProTableApi from './components/ProTableApi.vue'
import ProTableSearch from './components/ProTableSearch.vue'
import ProTableColums from './components/ProTableColums.vue'
import columns from './utils/columns'
import config from './utils/config'

export default defineComponent({
  components: {
    SearchOutlined,
    ProTableApi,
    ProTableSearch,
    ProTableColums
  },
  setup() {
    const { proxy }: any = getCurrentInstance()
    const state: any = reactive({
      tableRef: '',
      inputSearchRef: '',
      searchData: config.searchData,
      tableData: [],
      tableParameters: {
        source: undefined,
        title: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      columns: columns.index,
      proTable: columns.proTable,
      selectedRowKeys: [],
      selectedRowItems: []
    })
    const getTableData = async (params) => {
      const response: any = await getList({
        ...params,
        ...state.tableParameters
      })
      return {
        data: deepCopy(response?.data || []),
        success: response && response.code === 200,
        total: response.total,
        msg: (response && response.msg) || '系统出错，请稍后再试！'
      }
    }
    const onSelectChange = (keys, items) => {
      state.selectedRowKeys = keys
      state.selectedRowItems = handleSelectPage({
        oldSelectItems: deepCopy(state.selectedRowItems),
        selectItems: items,
        tableData: state.tableData
      })
    }
    const onReset = () => {}
    const onSearchReset = () => {
      state.inputSearchRef.changeValue('')
      state.tableParameters = {
        source: undefined,
        title: ''
      }
    }
    const batchOperation = (key) => {
      proxy.$message.success(`你点击了${key.domEvent.target.innerText}`)
    }
    return {
      ...toRefs(state),
      getTableData,
      onSelectChange,
      onReset,
      onSearchReset,
      batchOperation
    }
  }
})
</script>
