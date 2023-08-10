import { getInfo, updateEntity } from '@/services/example/language'
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import './utils/index.less'
import { useSeed, useStoreTabsRouter } from '@/store'
import { delayAsync } from '@sirpho/utils/delayAsync'
import { percentage } from '@sirpho/utils/math'
export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const tabsRouter = useStoreTabsRouter()
    const businessSeed = useSeed()
    const state = reactive({
      disabled: false,
      type: 'add',
      baseForm: {
        id: '',
        area: '',
        location: '',
        name: '',
        englishName: '',
        personType: '',
        desc: '',
        callNo: '',
        status: '',
        updatedAt: '',
        createdAt: '',
        progress: '',
        money: ''
      },
      fileList: [] as any[],
      submitLoading: false
    })

    onMounted(async () => {
      const { code } = route.params
      if (route.path.includes('add')) {
        state.type = 'add'
      }
      if (route.path.includes('edit')) {
        state.type = 'edit'
      }
      if (route.path.includes('watch')) {
        state.type = 'watch'
      }
      const res = await getInfo({
        id: code
      })
      if (res.code === 0) {
        Object.keys(state.baseForm).forEach((key) => {
          state.baseForm[key] = res.data[key]
        })
      }
    })

    /**
     * 修改文件
     */
    const handleChangeFile = (fileList) => {
      state.fileList = fileList
    }

    /**
     * 保存
     */
    const handleSave = async () => {
      if (state.submitLoading) {
        return
      }
      state.submitLoading = true
      await updateEntity(state.baseForm).finally(() => {
        state.submitLoading = false
      })
      await closeCurrentTab()
    }

    /**
     * 关闭tab
     */
    const closeCurrentTab = async () => {
      businessSeed.updateTemplateSeed()
      await delayAsync(0.2)
      tabsRouter.delVisitedRoute(route)
      const latestView = tabsRouter.visitedRoutes.slice(-1)[0]
      if (latestView) await router.push(latestView)
      else await router.push('/')
    }

    return () => {
      return (
        <g-pro-page-container>
          <g-bars>
            <a-descriptions title="活动信息" bordered size="small" column={2}>
              <a-descriptions-item label="地区">{state.baseForm.area}</a-descriptions-item>
              <a-descriptions-item label="姓名">{state.baseForm.name}</a-descriptions-item>
              <a-descriptions-item label="英文名">{state.baseForm.englishName}</a-descriptions-item>
              <a-descriptions-item label="描述">{state.baseForm.desc}</a-descriptions-item>
              <a-descriptions-item label="市场占有率">
                {percentage(state.baseForm?.progress || 0, 100)}
              </a-descriptions-item>
              <a-descriptions-item label="身价">{state.baseForm.money}</a-descriptions-item>
            </a-descriptions>
            <a-descriptions title="其他" bordered size="small">
              <a-descriptions-item label="附件" span={3}>
                <file-uploader fileList={state.fileList} onChange={handleChangeFile} />
              </a-descriptions-item>
            </a-descriptions>
          </g-bars>
          {!state.disabled && (
            <div class="footer-bar" style="width: calc(100% - 208px)">
              <a-button type="primary" loading={state.submitLoading} onClick={() => handleSave()}>
                保存
              </a-button>
            </div>
          )}
        </g-pro-page-container>
      )
    }
  }
})
