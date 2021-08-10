<template>
  <w-page-wrapper>
    <w-pro-table
      :key="tableKey"
      :columns="columns"
      :row-key="(record) => record.uuid"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      draggabled
      @refresh="fetch"
      @change="handleTableChange"
    >
      <template #fullTitle>
        FullName
      </template>
      <template #action>
        <a>action</a>
      </template>
    </w-pro-table>
  </w-page-wrapper>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getList } from '/@/services/table'
import { deepCopy, getRandomNumber } from '/@/utils/util'

const columns = [
  { dataIndex: 'name', key: 'name', width: 150, fixed: 'left', slots: { title: 'fullTitle' } },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 150, fixed: 'left' },
  { title: 'Column 1', dataIndex: 'address', key: '1', width: 150 },
  { title: 'Column 2', dataIndex: 'address', key: '2' },
  { title: 'Column 3', dataIndex: 'address', key: '3' },
  { title: 'Column 4', dataIndex: 'address', key: '4' },
  { title: 'Column 5', dataIndex: 'address', key: '5' },
  { title: 'Column 6', dataIndex: 'address', key: '6', width: 150 },
  {
    title: 'Action',
    width: 150,
    key: 'operation',
    slots: { customRender: 'action' }
  }
]
export default defineComponent({
  data() {
    return {
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableKey: getRandomNumber().uuid(15),
      loading: false,
      columns
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch()
    },
    fetch() {
      this.loading = true
      getList({
        pageSize: this.pagination.pageSize,
        current: this.pagination.current
      }).then(({ data, total }) => {
        this.loading = false
        const pagination = { ...this.pagination }
        pagination.total = total
        this.data = deepCopy(data)
        this.pagination = pagination
      })
    }
  }
})
</script>
