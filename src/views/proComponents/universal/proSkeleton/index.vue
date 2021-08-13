<template>
  <w-page-wrapper :class="$style['skeleton-block']">
    <BasicSkelecton />
    <ListSkelecton />
    <ResultSkelecton />
    <DescriptionsSkelecton />
  </w-page-wrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
    return {}
  }
})
</script>

<style lang="less" module>
.skeleton-block{
  :global{
    .ant-divider-horizontal.ant-divider-with-text-left::before{
      width: 0;
    }
    .ant-divider-inner-text{
      padding-left: 0;
    }
  }
}
</style>
