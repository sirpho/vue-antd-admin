<template>
  <w-page-wrapper>
    <div :class="$style.standardList">
      <a-card :bordered="false">
        <a-row>
          <a-col :sm="8" :xs="24">
            <div :class="$style.headerInfo">
              <span>我的待办</span>
              <p>8个任务</p>
              <em />
            </div>
          </a-col>
          <a-col :sm="8" :xs="24">
            <div :class="$style.headerInfo">
              <span>本周任务平均处理时间</span>
              <p>32分钟</p>
              <em />
            </div>
          </a-col>
          <a-col :sm="8" :xs="24">
            <div :class="$style.headerInfo">
              <span>本周完成任务数</span>
              <p>24个任务</p>
            </div>
          </a-col>
        </a-row>
      </a-card>
      
      <a-card
        style="margin-top: 24px"
        title="基本列表"
        :bodyStyle="{ padding: '0 32px 40px 32px' }"
        :class="$style.listCard"
        :bordered="false"
      >
        <template #extra>
          <div :class="$style.extraContent">
            <a-radio-group v-model:value="listParams.status" @change="changeSearch">
              <a-radio-button value="all">全部</a-radio-button>
              <a-radio-button value="normal">等待中</a-radio-button>
              <a-radio-button value="active">进行中</a-radio-button>
              <a-radio-button value="exception">失败</a-radio-button>
              <a-radio-button value="success">成功</a-radio-button>
            </a-radio-group>
            <a-input-search
              :class="$style.extraContentSearch"
              v-model:value="listParams.title"
              placeholder="请输入"
              allow-clear
              enter-button
              @search="changeSearch"
            />
          </div>
        </template>
        <a-list
          size="large"
          rowKey="id"
          :loading="loading"
          :dataSource="list"
          :pagination="paginationProps"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <a key="edit">编辑</a>
                <a-dropdown>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="edit">编辑</a-menu-item>
                      <a-menu-item key="delete">删除</a-menu-item>
                    </a-menu>
                  </template>
                  <a>
                    更多
                    <DownOutlined />
                  </a>
                </a-dropdown>
              </template>
              <a-list-item-meta :description="item.subDescription">
                <template #title>
                  <a :href="item.href">{{ item.title }}</a>
                </template>
                <template #avatar>
                  <a-avatar :src="item.logo" shape="square" size="large" />
                </template>
              </a-list-item-meta>
              <div :class="$style.listContent">
                <div :class="$style.listContentItem">
                  <span>Owner</span>
                  <p>{{ item.owner }}</p>
                </div>
                <div :class="$style.listContentItem">
                  <span>开始时间</span>
                  <p>{{ item.createdAt }}</p>
                </div>
                <div :class="$style.listContentItem">
                  <a-progress
                    style="width: 180px"
                    :strokeWidth="6"
                    :percent="item.percent"
                    :status="item.status"
                  />
                </div>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </div>
  </w-page-wrapper>
  <a-button type="dashed" style="width: 100%;margin-bottom: 8px">
    <PlusOutlined />
    添加
  </a-button>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  toRefs
} from 'vue'
import { PlusOutlined, DownOutlined } from '@ant-design/icons-vue'
import type { BasicListItemDataType } from '/@/services/list/basic'
import { getBasicList } from '/@/services/list/basic'

export default defineComponent({
  components: {
    PlusOutlined,
    DownOutlined
  },
  setup() {
    const { proxy }: any = getCurrentInstance()
    const state = reactive({
      loading: false,
      list: [],
      listParams: {
        title: '',
        status: 'all'
      } as Partial<BasicListItemDataType>,
      pageConfig: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      }
    })
    const paginationProps = computed(() => {
      return {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: state.pageConfig.pageSize,
        pageSizeOptions: [ '5', '10', '30', '50', '100' ],
        total: state.pageConfig.total,
        onChange: (page: number, pageSize: number) => {
          state.pageConfig.pageNum = page
          state.pageConfig.pageSize = pageSize
          getListData()
        }
      }
    })
    onMounted(() => {
      getListData()
    })
    const getListData = async () => {
      state.loading = true
      const response: any = await getBasicList({
        ...state.pageConfig,
        ...state.listParams
      })
      if (response) {
        state.list = response.data?.list || []
        state.pageConfig.total = response.data?.total || 0
      } else {
        proxy.$message.error((response && response.msg) || '系统错误，请稍后再试！')
      }
      state.loading = false
    }
    const changeSearch = () => {
      getListData()
    }
    return {
      ...toRefs(state),
      paginationProps,
      changeSearch
    }
  }
})
</script>

<style lang="less" module>
@import "./style";
</style>
