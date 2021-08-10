<template>
  <w-pro-table draggabled :columns="columns" :data-source="data" :loading="tableLoading" @refresh="refresh">
    <template #name="{ text }">
      <a>{{ text }}</a>
    </template>
    <template #action>
      <a>操作</a>
    </template>
  </w-pro-table>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    slots: {
      customRender: 'name'
    }
  },
  {
    title: 'Cash Assets',
    className: 'column-money',
    dataIndex: 'money'
  },
  {
    title: 'Address',
    dataIndex: 'address'
  },
  {
    title: 'action',
    dataIndex: 'action',
    slots: {
      customRender: 'action'
    }
  }
]
const data = [
  {
    key: '1',
    name: 'John Brown',
    money: '￥300,000.00',
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    money: '￥1,256,000.00',
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Joe Black',
    money: '￥120,000.00',
    address: 'Sidney No. 1 Lake Park'
  }
]
export default defineComponent({
  setup() {
    const tableLoading = ref(true)
    const refresh = () => {
      tableLoading.value = true
      setTimeout(() => {
        tableLoading.value = false
      }, 500)
    }
    setTimeout(() => {
      tableLoading.value = false
    }, 500)
    return {
      data,
      tableLoading,
      columns,
      refresh
    }
  }
})
</script>
