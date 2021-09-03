<template>
  <w-page-wrapper :contentStyle="{ position: 'relative' }" :class="$style['skeleton-block']">
    <w-doc :anchorLinks="links">
      <BasicSkelecton />
      <ListSkelecton />
      <ResultSkelecton />
      <DescriptionsSkelecton />
    </w-doc>
  </w-page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import BasicSkelecton from './components/BasicSkelecton.vue'
import ListSkelecton from './components/ListSkelecton.vue'
import ResultSkelecton from './components/ResultSkelecton.vue'
import DescriptionsSkelecton from './components/DescriptionsSkelecton.vue'

export default defineComponent({
  components: {
    BasicSkelecton,
    ListSkelecton,
    ResultSkelecton,
    DescriptionsSkelecton
  },
  setup() {
    const state = reactive({
      links: [
        {
          link: '#w-skeleton-demo',
          name: 'Skeleton'
        },
        {
          link: '#w-skeleton-api',
          name: 'Skeleton-API'
        },
        {
          link: '#w-pro-skeleton',
          name: 'ProSkeleton'
        },
        {
          link: '#w-pro-skeleton-list',
          level: 2,
          name: 'List'
        },
        {
          link: '#w-pro-skeleton-result',
          level: 2,
          name: '结果页'
        },
        {
          link: '#w-pro-skeleton-descriptions',
          level: 2,
          name: '详情页'
        },
        {
          link: '#w-pro-skeleton-api',
          name: 'ProSkeleton-API'
        }
      ]
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="less" module>
.skeleton-block {
  :global {
    .ant-divider-horizontal.ant-divider-with-text-left::before {
      width: 0;
    }
    
    .ant-divider-inner-text {
      padding-left: 0;
    }
  }
}
</style>
