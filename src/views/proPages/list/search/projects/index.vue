<template>
  <div :class="$style.coverCardList">
    <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
      <a-form :class="$style['page-list-search']" layout="inline" :model="listParams">
        <a-form-item :class="$style['form-list-row']" style="padding-bottom: 11px" label="所属类目">
          <w-tag-select
            v-model:value="listParams.category"
            expandable
            @change="changeSearch"
          >
            <w-tag-select-option :key="item" v-for="item in 12" :value="`cat${item}`">
              {{ `类目${item}` }}
            </w-tag-select-option>
          </w-tag-select>
        </a-form-item>
        <a-form-item :class="[ $style['form-list-row'], $style['form-list-row-last'] ]" label="其它选项">
          <a-row>
            <a-col :xl="8" :lg="10" :md="12" :sm="24" :xs="24">
              <a-form-item :wrapper-col="formItemLayout.wrapperCol" label="活跃用户">
                <a-select
                  v-model:value="listParams.user"
                  placeholder="不限"
                  allow-clear
                  style="width: 100%;max-width: 200px;"
                  @change="changeSearch"
                >
                  <a-select-option value="lisa">李三</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="8" :lg="10" :md="12" :sm="24" :xs="24">
              <a-form-item :wrapper-col="formItemLayout.wrapperCol" label="好评度">
                <a-select
                  v-model:value="listParams.rate"
                  placeholder="不限"
                  allow-clear
                  style="width: 100%;max-width: 200px;"
                  @change="changeSearch"
                >
                  <a-select-option value="good">优秀</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-card>
    <div :class="$style.cardList">
      <page-loading v-if="cardLoading" style="padding-top: 15px" />
      <a-list
        v-else
        rowKey="id"
        :loading="loading"
        :grid="{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }"
        :data-source="listSource"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card :class="$style.card" hoverable>
              <template #cover>
                <img :src="item.cover" :alt="item.title" />
              </template>
              <a-card-meta>
                <template #title>
                  <a>{{ item.title }}</a>
                </template>
                <template #description>
                  <a-typography-paragraph
                    :class="$style.item"
                    :ellipsis="{ rows: 2 }"
                    :content="item.subDescription"
                  />
                </template>
              </a-card-meta>
              <div :class="$style.cardItemContent">
                <span>{{ timeFromNow(item.updatedAt) }}</span>
                <div :class="$style.avatarList">
                  <AvatarList :data="item.members" size="small" />
                </div>
              </div>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onActivated, onMounted, reactive, toRefs } from 'vue'
import moment from 'moment'
import type { ListItemDataType } from '/@/services/list'
import { queryFakeList } from '/@/services/list'
import { PageLoading } from '@wd-pro/pro-layout'
import AvatarList from './components/AvatarList.vue'
import { formItemLayout } from '../utils/config'

interface articleStateType {
  pageConfig: any;
  listParams: any;
  cardLoading: boolean;
  loading: boolean;
  loadMore: boolean;
  loadingMore: boolean;
  listSource: any[];
}

export default defineComponent({
  components: {
    AvatarList,
    PageLoading
  },
  setup() {
    const state: articleStateType = reactive({
      pageConfig: {
        pageNum: 1,
        pageSize: 8
      },
      listParams: {
        category: [],
        owner: [ 'wjh', 'zxx' ],
        user: undefined,
        rate: undefined
      },
      cardLoading: false,
      loading: false,
      loadMore: true,
      loadingMore: false,
      listSource: []
    })
    onMounted(() => {
      onActiveLoad()
    })
    onActivated(async () => {
      onActiveLoad()
    })
    const onActiveLoad = (title?: string) => {
      state.listSource = []
      state.cardLoading = true
      setTimeout(() => {
        getFakeList(title)
      }, 500)
    }
    const getFakeList = async (title?: string) => {
      state.loading = true
      const response = await queryFakeList({
        query: state.pageConfig,
        data: { ...state.listParams, title }
      })
      if (response) {
        let list: ListItemDataType[] = response?.data || []
        state.listSource = [
          ...state.listSource,
          ...list
        ]
        state.loadMore = list.length === 0
      }
      state.loading = false
      state.cardLoading = false
      state.loadingMore = false
    }
    const loadMore = () => {
      state.loading = true
      state.loadingMore = true
      state.pageConfig.pageNum += 1
      setTimeout(() => {
        getFakeList()
      }, 500)
    }
    const setOwner = () => {
      state.listParams.owner = [ 'wzj' ]
    }
    const changeSearch = () => {
      onActiveLoad()
    }
    const timeFromNow = (time) => moment(time).fromNow()
    return {
      ...toRefs(state),
      formItemLayout,
      setOwner,
      loadMore,
      changeSearch,
      onActiveLoad,
      timeFromNow
    }
  }
})
</script>

<style lang="less" module>
@import "./style";
@import "../style";
</style>
