import { computed, onUnmounted, defineComponent, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { NoticeIconItem } from './NoticeList'
import NoticeIcon from './NoticeIcon'
import { useStore } from '@/store'

const getUnreadData = (noticeData: NoticeIconItem[]) => {
  return noticeData.filter((item) => item.isRead !== 'Y')
}

const NoticeIconView = defineComponent({
  setup() {
    const { notice: storeNotice } = useStore()
    storeNotice.connectWebSocket()

    onMounted(() => {
      storeNotice.queryNotices()
    })

    onUnmounted(() => {
      storeNotice.websocketClose()
    })

    const noticeNum = computed(() => storeNotice.noticeNum)

    const noticeData = computed(() => storeNotice.notices)

    const unreadMsg = computed(() => getUnreadData(noticeData.value))

    // 消息已读
    const changeReadState = async (id: string) => {
      storeNotice.changeReadState(id)
    }

    // 全部已读
    const clearReadState = () => {
      storeNotice.clearReadState()
    }

    return () => {
      return (
        <NoticeIcon
          class="gx-pro-right-content-action"
          count={unref(noticeNum)}
          onItemClick={(item) => {
            changeReadState(item.id)
          }}
          onClear={() => clearReadState()}
          loading={false}
          clearText="清空"
          viewMoreText="查看更多"
          onViewMore={() => message.info('Click on view more')}
          clearClose
        >
          <NoticeIcon.Tab
            tabKey="notification"
            count={unreadMsg.value}
            list={noticeData.value}
            title="我的消息"
            emptyText="暂无消息"
            showViewMore={false}
          />
        </NoticeIcon>
      )
    }
  }
})

export default NoticeIconView
