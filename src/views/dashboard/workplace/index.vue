<template>
  <w-page-wrapper>
    <div :class="$style.workplace">
      <a-page-header title="工作台" :backIcon="false">
        <template #extra>
        <span :class="$style.refresh" @click="reloadCurrentPage">
          <RedoOutlined />&nbsp;刷新
        </span>
        </template>
        <div class="wd-pro-page-container-row">
          <div class="wd-pro-page-container-content">
            <div :class="$style.avatar">
              <a-avatar size="large" :src="userInfo.avatar">
                <template #icon>
                  <a-spin>
                    <template #indicator>
                      <LoadingOutlined />
                    </template>
                  </a-spin>
                </template>
              </a-avatar>
            </div>
            <div :class="$style.content">
              <div :class="$style['content-title']">
                {{ timeFix }}，{{ userInfo.nickName }}<span :class="$style['welcome-text']">，{{ welcome }}</span>
              </div>
              <div>前端工程师 | （REACT，VUE，UNIAPP）平台</div>
            </div>
          </div>
          <div class="wd-pro-page-container-extraContent">
            <div :class="$style['extra-content']">
              <div :class="$style['stat-item']">
                <a-statistic title="项目数" :value="3" />
              </div>
              <div :class="$style['stat-item']">
                <a-statistic title="项目访问" :value="2223" />
              </div>
            </div>
          </div>
        </div>
      </a-page-header>
      <div style="margin: 24px">
        <a-row :gutter="24">
          <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
            <a-card
              :class="$style['project-list']"
              :loading="loading"
              style="margin-bottom: 24px;"
              :bordered="false"
              title="进行中的项目"
            >
              <template #extra>
                <a href="/">全部项目</a>
              </template>
              <div>
                <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in notice">
                  <a-card :bordered="false" :body-style="{ padding: 0 }">
                    <a-card-meta>
                      <template #title>
                        <div :class="$style['card-title']">
                          <a-avatar size="small" :src="item.logo" />
                          <a :href="item.href">{{ item.title }}</a>
                        </div>
                      </template>
                      <template #description>
                        <div :class="$style['card-description']">
                          {{ item.description }}
                        </div>
                      </template>
                    </a-card-meta>
                    <div :class="$style['project-item']">
                      <a :href="item.memberLink">{{ item.member || '' }}</a>
                      <span :class="$style.datetime">9小时前</span>
                    </div>
                  </a-card>
                </a-card-grid>
              </div>
            </a-card>
            <a-card :loading="dynamicLoading" title="全部动态" :bordered="false">
              <a-list :class="$style['activities-list']">
                <a-list-item :key="index" v-for="(item, index) in activities">
                  <a-list-item-meta>
                    <template #avatar>
                      <a-avatar :src="item.user.avatar" />
                    </template>
                    <template #title>
                      <a class="username">{{ item.user.name }}</a>&nbsp;
                      <span class="event">
                      <template
                        :key="index"
                        v-for="(key, index) in item.template.split(/@\{([^{}]*)\}/gi)"
                      >
                        <template v-if="item[key]">
                          <a v-if="item[key]" :href="item[key].link">
                            {{ item[key].name }}
                          </a>
                        </template>
                        <template v-else>{{ key }}</template>
                      </template>
                    </span>
                    </template>
                    <template #description>
                      <span :class="$style.datetime">{{ momentFromNow(item.updatedAt) }}</span>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-card>
          </a-col>
          <a-col
            style="padding: 0 12px"
            :xl="8"
            :lg="24"
            :md="24"
            :sm="24"
            :xs="24"
          >
            <a-card
              title="快速开始 / 便捷导航"
              style="margin-bottom: 24px"
              :bordered="false"
            >
              <div :class="$style['item-group']">
                <a>操作一</a>
                <a>操作二</a>
                <a>操作三</a>
                <a>操作四</a>
                <a>操作五</a>
                <a>操作六</a>
                <a-button size="small" type="primary" ghost>
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  添加
                </a-button>
              </div>
            </a-card>
            <a-card
              title="XX 指数"
              style="margin-bottom: 24px"
              :loading="radarLoading"
              :bordered="false"
            >
              <Radar :data="radarData" :max="radarMaxCount" />
            </a-card>
            <a-card :loading="loading" title="团队" :bordered="false">
              <div :class="$style.members">
                <a-row>
                  <a-col :span="12" v-for="(item, index) in notice" :key="index">
                    <a>
                      <a-avatar size="small" :src="item.logo" />
                      <span :class="$style.member">{{ item.title }}</span>
                    </a>
                  </a-col>
                </a-row>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>
  </w-page-wrapper>
</template>

<script lang="ts">
import { PlusOutlined, RedoOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import {
  defineComponent,
  ref,
  computed,
  reactive,
  toRefs,
  onMounted,
  inject
} from 'vue'
import { useStore } from 'vuex'
import { notice, activities, radar } from '/@/services/workplace'
import { timeFix, momentFromNow } from '/@/utils/util'
import Radar from './components/Radar.vue'

interface stateTypes {
  timeFix: string,
  notice: any[];
  activities: any[];
  axisData: any[];
  radarData: any[];
  loading: boolean;
  radarMaxCount: number;
  dynamicLoading: boolean;
  radarLoading: boolean;
}

export default defineComponent({
  components: { PlusOutlined, RedoOutlined, LoadingOutlined, Radar },
  setup() {
    const store = useStore()
    const reloadCurrentPage: any = inject('reload')
    const welcome = ref('祝你开心每一天！')
    const state: stateTypes = reactive({
      timeFix: timeFix(),
      notice: [],
      loading: true,
      dynamicLoading: true,
      radarLoading: true,
      activities: [],
      radarData: [],
      radarMaxCount: 10,
      chart: null,
      axisData: [
        { item: '引用', a: 70, b: 30, c: 40 },
        { item: '口碑', a: 60, b: 70, c: 40 },
        { item: '产量', a: 50, b: 60, c: 40 },
        { item: '贡献', a: 40, b: 50, c: 40 },
        { item: '热度', a: 60, b: 70, c: 40 },
        { item: '引用', a: 70, b: 50, c: 40 }
      ]
    })
    onMounted(() => {
      getProjects()
      getActivity()
      getRadar()
    })
    const getProjects = async () => {
      const response: any = await notice()
      state.notice = response.data || []
      state.loading = false
    }
    const getActivity = async () => {
      const response: any = await activities()
      state.activities = response.data || []
      state.dynamicLoading = false
    }
    const getRadar = async () => {
      const { data = {} }: any = await radar()
      const { radarData = [] } = data
      let datasource: any = []
      radarData.map(item => {
        if (datasource.every(el => el['item'] !== item.label)) {
          const radarItems: any = { item: item.label }
          radarItems[item.name] = item.value
          datasource.push(radarItems)
        } else {
          datasource = datasource.map((el: any) => {
            if (el['item'] === item.label) el[item.name] = item.value
            return el
          })
        }
        return item
      })
      state.radarData = datasource
      state.radarMaxCount = handelMaxRandar(radarData)
      state.radarLoading = false
    }
    const handelMaxRandar = (datasource) => {
      return datasource.sort((obj1, obj2) => {
        const val1 = obj1.value
        const val2 = obj2.value
        let result = 0
        if (val1 < val2) {
          result = 1
        } else if (val1 > val2) {
          result = -1
        }
        return result
      })[0]?.value || 0
    }
    return {
      userInfo: computed(() => store.getters['user/userInfo']),
      ...toRefs(state),
      welcome,
      momentFromNow,
      reloadCurrentPage
    }
  }
})
</script>

<style lang="less" module>
@import "./style";
</style>
