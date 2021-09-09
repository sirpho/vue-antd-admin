<template>
  <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
    <a-form>
      <a-form-item :class="$style['form-list-row']" label="所属类目">
        <w-tag-select expandable>
          <w-tag-select-option :key="item" v-for="item in 12" :value="`cat${item}`">
            {{ `类目${item}` }}
          </w-tag-select-option>
        </w-tag-select>
      </a-form-item>
    </a-form>
  </a-card>
  <a-card :bordered="false" style="margin-top: 24px" :body-style="{ padding: '8px 32px 32px 32px' }">
  
  </a-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { queryFakeList } from '/@/services/list'

export default defineComponent({
  setup() {
    const count = ref(5)
    const state = reactive({
      formState: {
        category: '',
        owner: ['wjh', 'zxx'],
        user: '',
        rate: '',
      }
    })
    const owners = [
      {
        id: 'wzj',
        name: '我自己'
      },
      {
        id: 'wjh',
        name: '吴家豪'
      },
      {
        id: 'zxx',
        name: '周星星'
      },
      {
        id: 'zly',
        name: '赵丽颖'
      },
      {
        id: 'ym',
        name: '姚明'
      }
    ]
    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 12 },
      },
    }
    onMounted(async () => {
      getFakeList()
    })
    const getFakeList = async () => {
      const response = await queryFakeList({
        count: count.value
      })
      if (response) {

      }
    }
    const changeSearch = () => {
      console.log(123)
    }
    return {
      ...toRefs(state),
      changeSearch
    }
  }
})
</script>

<style lang="less" module>
@import "./style";
@import "../style";
</style>
