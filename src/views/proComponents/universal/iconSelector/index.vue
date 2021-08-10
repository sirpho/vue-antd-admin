<template>
  <w-page-wrapper>
    <div class="icon-container">
      <a-button @click="$refs.operation.open()" style="margin-bottom: 20px" type="primary">
        打开Modal
      </a-button>
      <a-alert message="点击图标即可复制代码" type="success" show-icon></a-alert>
      <a-row>
        <a-col :xxl="6" :xl="6" :lg="8" :md="8" :sm="8" :xs="24">
          <a-input-search
            v-model:value="queryForm.title"
            placeholder="图标名称"
            enter-button
            @search="queryData"
          />
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col
          v-for="(item, index) in queryIcon"
          :key="index"
          :lg="2"
          :md="3"
          :sm="8"
          :xl="2"
          :xs="6"
        >
          <a-card shadow="hover" @click="handleCopyIcon(item, $event)">
            <w-icon :icon="item"></w-icon>
          </a-card>
          <div class="icon-text" @click="handleCopyText(item, $event)">
            {{ item }}
          </div>
        </a-col>
        
        <a-col v-if="queryIcon.length > 0" :span="24">
          <a-pagination
            show-quick-jumper
            v-model:current="queryForm.current"
            v-model:pageSize="queryForm.pageSize"
            :total="total"
            @change="handleCurrentChange"
            @showSizeChange="handlePageSizeChange"
          />
        </a-col>
      </a-row>
      <OperationModal ref="operation" />
    </div>
  </w-page-wrapper>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getIconList } from '/@/services/icon'
import clip from '/@/utils/clipboard'
import OperationModal from './components/OperationModal.vue'

export default defineComponent({
  components: {
    OperationModal
  },
  data() {
    return {
      total: 0,
      queryIcon: [],
      queryForm: {
        current: 1,
        pageSize: 72,
        title: ''
      }
    }
  },
  activated() {
    this.fetchData()
  },
  methods: {
    handlePageSizeChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.current = val
      this.fetchData()
    },
    queryData() {
      this.queryForm.current = 1
      this.fetchData()
    },
    async fetchData() {
      const { data, totalCount } = await getIconList(this.queryForm)
      this.queryIcon = data
      this.total = totalCount
    },
    handleCopyText(item, event) {
      clip(item, event)
    },
    handleCopyIcon(item, event) {
      clip(`<w-icon icon="${item}"></w-icon>`, event)
    }
  }
})
</script>

<style lang="less">
.icon-container{
  .icon-list{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    
    .icon-list_item{
      margin-right: 20px;
    }
  }
  
  .ant-input-search,
  .ant-alert{
    margin-bottom: 20px;
  }
  
  .ant-card-body{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 68px;
    cursor: pointer;
    
    i{
      font-size: 28px;
      text-align: center;
      pointer-events: none;
      cursor: pointer;
    }
  }
  
  .icon-text{
    height: 30px;
    overflow: hidden;
    font-size: 12px;
    line-height: 30px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
