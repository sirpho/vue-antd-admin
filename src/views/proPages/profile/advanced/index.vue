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
          <a-dropdown-button type="primary" placement="bottomRight">
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
            <a-dropdown placement="bottomRight">
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
      <a-tabs v-model:activeKey="tabStatus.tabActiveKey" @change="onTabChange">
        <a-tab-pane v-for="item in tabList" :key="item.key" :tab="item.tab" />
      </a-tabs>
    </div>
    <div :class="$style.main">
      <a-card
        :class="$style['main-card']"
        title="流程进度"
        style="margin-bottom: 24px"
        :bordered="false"
      >
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
      <a-card
        :class="$style['main-card']"
        title="用户信息"
        style="margin-bottom: 24px"
        :bordered="false"
      >
        <a-descriptions style="margin-bottom: 24px">
          <a-descriptions-item label="用户姓名">付小小</a-descriptions-item>
          <a-descriptions-item label="会员卡号">32943898021309809423</a-descriptions-item>
          <a-descriptions-item label="身份证">3321944288191034921</a-descriptions-item>
          <a-descriptions-item label="联系方式">18112345678</a-descriptions-item>
          <a-descriptions-item label="联系地址">
            曲丽丽 18100000000 浙江省杭州市西湖区黄姑山路工专路交叉路口
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions style="margin-bottom: 24px" title="信息组">
          <a-descriptions-item label="某某数据">725</a-descriptions-item>
          <a-descriptions-item label="该数据更新时间">2017-08-08</a-descriptions-item>
          <a-descriptions-item>
            <template #label>
              <span>
                某某数据
                <a-tooltip title="数据说明">
                  <InfoCircleOutlined style="margin-left: 4px;color: rgba(0, 0, 0, 0.43);" />
                </a-tooltip>
              </span>
            </template>
          </a-descriptions-item>
          <a-descriptions-item label="该数据更新时间">2017-08-08</a-descriptions-item>
        </a-descriptions>
        <h4 style="margin-bottom: 16px">信息组</h4>
        <a-card type="inner" title="多层级信息组">
          <a-descriptions style="margin-bottom: 16px" title="组名称">
            <a-descriptions-item label="负责人">林东东</a-descriptions-item>
            <a-descriptions-item label="角色码">1234567</a-descriptions-item>
            <a-descriptions-item label="所属部门">XX公司 - YY部</a-descriptions-item>
            <a-descriptions-item label="过期时间">2017-08-08</a-descriptions-item>
            <a-descriptions-item label="描述">
              这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...
            </a-descriptions-item>
          </a-descriptions>
          <a-divider style="margin: 16px 0" />
          <a-descriptions style="margin-bottom: 16px" title="组名称" :column="1">
            <a-descriptions-item label="学名">
              Citrullus lanatus (Thunb.) Matsum. et
              Nakai一年生蔓生藤本；茎、枝粗壮，具明显的棱。卷须较粗..
            </a-descriptions-item>
          </a-descriptions>
          <a-divider style="margin: 16px 0" />
          <a-descriptions title="组名称">
            <a-descriptions-item label="负责人">付小小</a-descriptions-item>
            <a-descriptions-item label="角色码">1234568</a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-card>
      <a-card
        :class="$style['main-card']"
        title="用户近半年来电记录"
        style="margin-bottom: 24px"
        :bordered="false"
      >
        <a-empty />
      </a-card>
      <a-card
        :class="[ $style['main-card'], $style.tabsCard ]"
        :tabList="operationTabList"
        :bordered="false"
        @tabChange="onOperationTabChange"
      >
        <template v-for="(item, index) in operationTabList">
          <w-pro-table
            v-if="item.key === tabStatus.operationKey"
            :key="index"
            :showIndex="false"
            :showPagination="false"
            :options="false"
            :loading="false"
            :toolBarBtn="false"
            :dataSource="item.tableData"
            :columns="columns"
          >
            <template #status="{ text }">
              <a-badge
                :status="text === 'agree' ? 'success' : 'error'"
                :text="text === 'agree' ? '成功' : '驳回'"
              />
            </template>
          </w-pro-table>
        </template>
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
import {
  DownOutlined,
  EllipsisOutlined,
  DingdingOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'
import { queryAdvancedProfile } from '/@/services/profile/advanced'
import useMediaQuery from '/@/components/_util/useMediaQuery'
import { columns } from './utils/columns'
import { tabList, operationTabList } from './utils/config'

type AdvancedState = {
  operationKey: string;
  tabActiveKey: string;
};

export default defineComponent({
  components: {
    DownOutlined,
    EllipsisOutlined,
    DingdingOutlined,
    InfoCircleOutlined
  },
  setup() {
    const colSize = useMediaQuery()
    const { proxy }: any = getCurrentInstance()
    const state = reactive({
      loading: false,
      tabStatus: {
        operationKey: 'tab1',
        tabActiveKey: 'detail'
      } as AdvancedState,
      tabList: tabList,
      operationTabList: operationTabList,
      columns
    })
    const isMobile = computed(
      () => (colSize.value === 'sm' || colSize.value === 'xs')
    )
    onActivated(() => {
      getListData()
      setTimeout(() => {
        state.tabStatus.tabActiveKey = 'detail'
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
        state.operationTabList = state.operationTabList.map((item: any) => {
          switch (item.key) {
            case 'tab1':
              item.tableData = advancedOperation1
              break
            case 'tab2':
              item.tableData = advancedOperation2
              break
            case 'tab3':
              item.tableData = advancedOperation3
              break
          }
          return item
        })
      }
      state.loading = false
    }
    const onTabChange = (tabActiveKey: string) => {
      state.tabStatus = {
        ...state.tabStatus,
        tabActiveKey
      }
    }
    const onOperationTabChange = (key: string) => {
      state.tabStatus = {
        ...state.tabStatus,
        operationKey: key
      }
    }
    return {
      ...toRefs(state),
      isMobile,
      getListData,
      onTabChange,
      onOperationTabChange
    }
  }
})
</script>

<style lang="less" module>
@import "./style";
</style>
