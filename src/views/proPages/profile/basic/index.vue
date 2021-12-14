<template>
  <g-pro-page-wrapper>
    <a-card :bordered="false">
      <a-descriptions title="退款申请" style="margin-bottom: 32px">
        <a-descriptions-item label="取货单号">
          1000000000
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          已取货
        </a-descriptions-item>
        <a-descriptions-item label="销售单号">
          1234123421
        </a-descriptions-item>
        <a-descriptions-item label="子订单">
          3214321432
        </a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px" />
      <a-descriptions title="用户信息" style="margin-bottom: 32px">
        <a-descriptions-item label="用户姓名">
          付小小
        </a-descriptions-item>
        <a-descriptions-item label="联系电话">
          18100000000
        </a-descriptions-item>
        <a-descriptions-item label="常用快递">
          菜鸟仓储
        </a-descriptions-item>
        <a-descriptions-item label="取货地址">
          浙江省杭州市西湖区万塘路18号
        </a-descriptions-item>
        <a-descriptions-item label="备注">
          无
        </a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px" />
      <div :class="$style.title">退货商品</div>
      <g-pro-table
        style="margin-bottom: 24px"
        rowKey="id"
        :bordered="false"
        :showIndex="false"
        :showPagination="false"
        :loading="loading"
        :options="false"
        :toolBarBtn="false"
        :dataSource="goodsData"
        :columns="goodsColumns"
      />
      <div :class="$style.title">退货进度</div>
      <g-pro-table
        style="margin-bottom: 16px"
        rowKey="key"
        :bordered="false"
        :showIndex="false"
        :showPagination="false"
        :loading="loading"
        :options="false"
        :toolBarBtn="false"
        :dataSource="basicProgress"
        :columns="progressColumns"
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'status'">
            <a-badge
              :status="text === 'success' ? 'success' : 'processing'"
              :text="text === 'success' ? '成功' : '进行中'"
            />
          </template>
        </template>
      </g-pro-table>
    </a-card>
  </g-pro-page-wrapper>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  h,
  onActivated,
  reactive,
  toRefs
} from 'vue'
import { queryBasicProfile } from '/@/services/profile/basic'
import { progressColumns } from './utils/columns'

export default defineComponent({
  setup() {
    const state = reactive({
      loading: false,
      goodsData: [],
      basicGoods: [],
      basicProgress: []
    })
    onActivated(() => {
      getListData()
    })
    const renderContent = ({ text, index }) => {
      const obj: {
        children: any;
        props: { colSpan?: number };
      } = {
        children: text,
        props: {}
      }
      if (index === state.basicGoods.length) {
        obj.props.colSpan = 0
      }
      return obj
    }
    const goodsColumns = computed(() => {
      return [
        {
          title: '商品编号',
          dataIndex: 'id',
          key: 'id',
          customRender: ({ text, index }) => {
            if (index < state.basicGoods.length) {
              return h('span', {}, text)
            }
            return {
              children: h('span', { style: { fontWeight: 600 } }, text),
              props: {
                colSpan: 4
              }
            }
          }
        },
        {
          title: '商品名称',
          dataIndex: 'name',
          key: 'name',
          customRender: renderContent
        },
        {
          title: '商品条码',
          dataIndex: 'barcode',
          key: 'barcode',
          customRender: renderContent
        },
        {
          title: '单价',
          dataIndex: 'price',
          key: 'price',
          align: 'right' as 'left' | 'right' | 'center',
          customRender: renderContent
        },
        {
          title: '数量（件）',
          dataIndex: 'num',
          key: 'num',
          align: 'right' as 'left' | 'right' | 'center',
          customRender: ({ text, index }) => {
            if (index < state.basicGoods.length) {
              return text
            }
            return h('span', { style: { fontWeight: 600 } }, text)
          }
        },
        {
          title: '金额',
          dataIndex: 'amount',
          key: 'amount',
          align: 'right' as 'left' | 'right' | 'center',
          customRender: ({ text, index }) => {
            if (index < state.basicGoods.length) {
              return text
            }
            return h('span', { style: { fontWeight: 600 } }, text)
          }
        }
      ]
    })
    const getListData = async () => {
      state.loading = true
      const response: any = await queryBasicProfile()
      if (response) {
        const { basicGoods, basicProgress } = response.data || {
          basicGoods: [],
          basicProgress: []
        }
        let goodsData: typeof basicGoods = []
        if (basicGoods.length) {
          let num = 0
          let amount = 0
          basicGoods.forEach((item) => {
            num += Number(item.num)
            amount += Number(item.amount)
          })
          goodsData = basicGoods.concat({
            id: '总计',
            num,
            amount
          })
        }
        state.basicGoods = basicGoods
        state.goodsData = goodsData
        state.basicProgress = basicProgress
      }
      state.loading = false
    }
    return {
      ...toRefs(state),
      goodsColumns,
      progressColumns,
      getListData
    }
  }
})
</script>

<style lang="less" module>
@import "./style";
</style>
