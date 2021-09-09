<template>
  <w-page-wrapper>
    <div :class="$style['search-header-row']">
      <div :class="$style['search-header-content']">
        <a-input-search
          style="max-width: 550px"
          v-model:value="searchValue"
          placeholder="请输入"
          size="large"
        >
          <template #enterButton>
            <a-button type="primary">搜索</a-button>
          </template>
        </a-input-search>
      </div>
    </div>
    <div :class="$style['search-content-warp']">
      <a-tabs v-model:activeKey="tabActiveKey">
        <a-tab-pane v-for="item in tabList" :key="item.key" :tab="item.tab">
          <a-card :bordered="false">
            <Articles v-if="item.key === 'articles'" />
            <Projects v-if="item.key === 'projects'" />
            <Applications v-if="item.key === 'applications'" />
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </div>
  </w-page-wrapper>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue'
import Articles from './articles/index.vue'
import Projects from './projects/index.vue'
import Applications from './applications/index.vue'

const tabList = [
  {
    key: 'articles',
    tab: '文章'
  },
  {
    key: 'projects',
    tab: '项目'
  },
  {
    key: 'applications',
    tab: '应用'
  }
]

export default defineComponent({
  components: {
    Projects,
    Articles,
    Applications
  },
  setup() {
    const searchValue = ref('')
    const tabActiveKey: Ref<string> = ref('')
    onMounted(() => {
      setTimeout(() => {
        tabActiveKey.value = 'articles'
      }, 200)
    })
    return {
      tabActiveKey,
      tabList,
      searchValue,
    }
  }
})
</script>

<style lang="less" module>
.search-header-row {
  display: flex;
  width: 100%;
  
  .search-header-content {
    flex: auto;
    width: 100%;
    text-align: center;
  }
}
</style>
