<template>
  <g-pro-page-wrapper>
    <g-pro-table
      draggabled
      :options="false"
      row-key="sortIndex"
      :columns="columns"
      :dataSource="tableData"
      :pagination="{
        pageSize: innerWidth < 1200 ? 20 : 10,
        showLessItems: true
      }"
    />
  </g-pro-page-wrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'

const innerWidth = ref(window.innerWidth)
const tableData = ref([])

const columns = ref([
  {
    title: '发票种类',
    dataIndex: 'name'
  },
  {
    title: '发票代码',
    dataIndex: 'des',
    width: 200
  },
  {
    title: '发票代码1',
    dataIndex: 'dess'
  },
  {
    title: '发票代码2',
    dataIndex: 'desss'
  },
  {
    title: '发票代码3',
    dataIndex: 'dessss',
    sorter: (a, b) => {
      let aTime = new Date(a.dessss).getTime()
      let bTime = new Date(b.dessss).getTime()
      return aTime - bTime
    },
    defaultSortOrder: 'descend'
  },
  {
    title: '发票代码4',
    dataIndex: 'desssss'
  },
  {
    title: '发票代码5',
    dataIndex: 'desssssss'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 120
  }
])

const pagination = reactive({
  pageSize: 10,
  showLessItems: true
})

onMounted(() => {
  window.addEventListener('resize', getWidth)
  for (let i = 0; i < 20; i += 1) {
    tableData.value.push({
      id: i,
      name: `test-${i + 1}`,
      des: '123456789',
      dess: '123456789',
      desss: '123456789',
      dessss: `2022-02-22 10:00:${i < 10 ? `0${i}` : i}`,
      desssss: '123456789',
      desssssss: '123456789',
      action: '123'
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', getWidth)
})

const getWidth = () => {
  innerWidth.value = window.innerWidth
  if (innerWidth.value < 1300) {
    pagination.pageSize = 20
  } else {
    pagination.pageSize = 10
  }
}
</script>

<style lang="less" module></style>
