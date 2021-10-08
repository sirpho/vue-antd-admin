<template>
  <w-page-wrapper>
    <div :class="$style['header-deading']">
      <div :class="$style['header-deading-left']">
        <div :class="$style['header-deading-title']">
          单号：234231029431
        </div>
      </div>
      <div :class="$style['header-deading-extra']">
        <template v-if="isMobile">
          <a-dropdown-button>
            <template #icon>
              <DownOutlined />
            </template>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1">操作一</a-menu-item>
                <a-menu-item key="2">操作二</a-menu-item>
                <a-menu-item key="3">选项一</a-menu-item>
                <a-menu-item key="4">选项二</a-menu-item>
                <a-menu-item key="5">选项三</a-menu-item>
              </a-menu>
            </template>
            主操作
          </a-dropdown-button>
        </template>
        <template v-else>
          <a-button-group>
            <a-button>操作一</a-button>
            <a-button>操作二</a-button>
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">选项一</a-menu-item>
                  <a-menu-item key="2">选项二</a-menu-item>
                  <a-menu-item key="3">选项三</a-menu-item>
                </a-menu>
              </template>
              <a-button>
                <EllipsisOutlined />
              </a-button>
            </a-dropdown>
          </a-button-group>
          <a-button type="primary">主操作</a-button>
        </template>
      </div>
    </div>
    <div :class="$style['header-content']">
      <div :class="$style['container-detail']">
        <div :class="$style['container-main']">
          <div :class="$style['container-row']">
            <div :class="$style['container-content']">
              <a-descriptions :class="$style.headerList" size="small" :column="isMobile ? 1 : 2">
                <a-descriptions-item label="创建人">曲丽丽</a-descriptions-item>
                <a-descriptions-item label="订购产品">XX 服务</a-descriptions-item>
                <a-descriptions-item label="创建时间">2017-07-07</a-descriptions-item>
                <a-descriptions-item label="关联单据">
                  <a>12421</a>
                </a-descriptions-item>
                <a-descriptions-item label="生效日期">2017-07-07 ~ 2017-08-08</a-descriptions-item>
                <a-descriptions-item label="备注">请于两个工作日内确认</a-descriptions-item>
              </a-descriptions>
            </div>
            <div :class="$style['container-extraContent']">
              <div :class="$style.moreInfo">
                <a-statistic title="状态" value="待审批" />
                <a-statistic title="订单金额" :value="568.08" prefix="¥" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="$style['header-footer']">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane v-for="item in tabList" :key="item.key" :tab="item.tab"></a-tab-pane>
      </a-tabs>
    </div>
    <div :class="$style.main">
      <a-card title="流程进度" :style="{ marginBottom: '24px' }">
        <a-steps :direction="isMobile ? 'vertical' : 'horizontal'" :current="1">
          <template #progressDot="{ status, prefixCls }">
            <a-popover v-if="status === 'process'" placement="topLeft" arrowPointAtCenter>
              <template #content>
                <div style="width: 160px">
                  吴加号
                  <span style="float: right;">
                    <a-badge status="default">
                      <template #text>
                        <span style="color: rgba(0, 0, 0, 0.45)">未响应</span>
                      </template>
                    </a-badge>
                  </span>
                  <div style="margin-top: 4px">
                    耗时：2小时25分钟
                  </div>
                </div>
              </template>
              <span :class="`${prefixCls}-icon-dot`" />
            </a-popover>
            <span v-else :class="`${prefixCls}-icon-dot`" />
          </template>
          <a-step title="创建项目">
            <template #description>
              <div :class="$style.stepDescription">
                <div>
                  曲丽丽
                  <DingdingOutlined :style="{ marginLeft: '8px' }" />
                </div>
                <div>2016-12-12 12:32</div>
              </div>
            </template>
          </a-step>
          <a-step title="部门初审">
            <template #description>
              <div :class="$style.stepDescription">
                <div>
                  周毛毛
                  <DingdingOutlined :style="{ color: '#00A0E9',marginLeft: '8px' }" />
                </div>
                <div><a>催一下</a></div>
              </div>
            </template>
          </a-step>
          <a-step title="财务复核" />
          <a-step title="完成" />
        </a-steps>
      </a-card>
    </div>
  </w-page-wrapper>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onActivated,
  reactive,
  toRefs
} from 'vue'
import { DownOutlined, EllipsisOutlined, DingdingOutlined } from '@ant-design/icons-vue'
import { queryAdvancedProfile } from '/@/services/profile/advanced'
import useMediaQuery from '/@/components/_util/useMediaQuery'

export default defineComponent({
  components: {
    DownOutlined,
    EllipsisOutlined,
    DingdingOutlined
  },
  setup() {
    const colSize = useMediaQuery()
    const { proxy }: any = getCurrentInstance()
    const state = reactive({
      loading: false,
      activeKey: '',
      tabList: [
        {
          key: 'detail',
          tab: '详情'
        },
        {
          key: 'rule',
          tab: '规则'
        }
      ],
      tableList: {
        advancedOperation1: [],
        advancedOperation2: [],
        advancedOperation3: []
      }
    })
    const isMobile = computed(
      () => (colSize.value === 'sm' || colSize.value === 'xs')
    )
    onActivated(() => {
      setTimeout(() => {
        state.activeKey = 'detail'
      }, 200)
    })
    const getListData = async () => {
      state.loading = true
      const response: any = await queryAdvancedProfile()
      if (response) {
        const {
          advancedOperation1 = [],
          advancedOperation2 = [],
          advancedOperation3 = []
        } = response.data || {}
        state.tableList.advancedOperation1 = advancedOperation1
        state.tableList.advancedOperation2 = advancedOperation2
        state.tableList.advancedOperation3 = advancedOperation3
      } else {
        proxy.$message.error((response && response.msg) || '系统错误，请稍后再试！')
      }
      state.loading = false
    }
    return {
      ...toRefs(state),
      isMobile,
      getListData
    }
  }
})
</script>

<style lang="less" module>
@import "./style";
</style>
