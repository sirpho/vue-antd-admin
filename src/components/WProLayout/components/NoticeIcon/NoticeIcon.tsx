import {
  computed,
  CSSProperties,
  defineComponent,
  ExtractPropTypes,
  ref
} from 'vue'
import { BellOutlined } from '@ant-design/icons-vue'
import { PropTypes } from '/@/utils'
import NoticeList, { NoticeIconItem, NoticeIconTabProps } from './NoticeList'

import styles from './index.module.less'

export const noticeIconProps = {
  count: PropTypes.number,
  className: PropTypes.string,
  loading: PropTypes.looseBool,
  onClear: Function as PropType<(tabName: string, tabKey: string) => void>,
  onItemClick: Function as PropType<(item: NoticeIconItem, tabProps: NoticeIconTabProps) => void>,
  onViewMore: Function as PropType<(tabProps: NoticeIconTabProps, e: MouseEvent) => void>,
  onTabChange: Function as PropType<(tabTile: string) => void>,
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => undefined
  },
  onPopupVisibleChange: Function as PropType<(visible: boolean) => void>,
  popupVisible: PropTypes.looseBool,
  clearText: PropTypes.string,
  viewMoreText: PropTypes.string,
  clearClose: PropTypes.looseBool,
  emptyImage: PropTypes.string
}

export type NoticeIconProps = Partial<ExtractPropTypes<typeof noticeIconProps>>;

const NoticeIcon = defineComponent({
  props: noticeIconProps,
  emits: [ 'onClear', 'onTabChange', 'onItemClick', 'onViewMore', 'onPopupVisibleChange' ],
  setup(props, { emit, slots }) {
    const visible = ref(props.popupVisible || false)

    const activeKey = ref('notification')

    const getChildrenSlots: any = computed(() => slots.default?.().length === 1 &&
      (
        String(slots.default?.()[0].type) === String(Symbol('Fragment')) ||
        String(slots.default?.()[0].type) === String(Symbol())
      )
        ? slots.default?.()[0].children || []
        : slots.default?.() || []
    )

    const notificationBox = computed(() => {
      const {
        loading,
        onClear,
        onItemClick,
        onViewMore,
        clearText,
        viewMoreText
      } = props

      if (getChildrenSlots.value.length === 0) {
        return null
      }

      const panes: any = []

      getChildrenSlots.value.map((item: any) => {
        if (!item) {
          return
        }

        const { list, title, count, tabKey, showClear, showViewMore, emptyText } = item.props
        const len = list && list.length ? list.length : 0
        const msgCount = count || count === 0 ? count : len
        const tabTitle: string = msgCount > 0 ? `${title} (${msgCount})` : title
        panes.push(
          <a-tab-pane tab={tabTitle} key={tabKey}>
            <NoticeList
              clearText={clearText}
              viewMoreText={viewMoreText}
              list={list}
              tabKey={tabKey}
              onClear={(): void => onClear && onClear(title, tabKey)}
              onClick={(el): void => onItemClick && onItemClick(el, item.props)}
              onViewMore={(event): void => onViewMore && onViewMore(item.props, event)}
              emptyText={emptyText}
              showClear={showClear}
              showViewMore={showViewMore}
              title={title}
            />
          </a-tab-pane>
        )
      })

      return (
        <>
          <a-spin spinning={loading} delay={300}>
            <a-tabs class={styles['tabs']} activeKey={activeKey.value} onChange={onTabChange}>
              {panes}
            </a-tabs>
          </a-spin>
        </>
      )
    })

    const onChange = (value: boolean) => {
      visible.value = value
      emit('onPopupVisibleChange', value)
    }

    const onTabChange = (key) => {
      activeKey.value = key
      props.onTabChange && props.onTabChange(key)
    }

    const NoticeBellIcon = <BellOutlined class={styles['icon']} />

    const trigger = computed(() => (
      <span
        class={{
          [`${props.className}`]: true,
          [`${styles['noticeButton']}`]: true,
          [`opened`]: visible.value
        }}
        onClick={() => onChange(true)}
      >
        <a-badge count={props.count} style={{ boxShadow: 'none' }} class={styles.badge}>
          {NoticeBellIcon}
        </a-badge>
      </span>
    ))

    if (!notificationBox.value) {
      return trigger.value
    }

    return () => {
      return (
        <a-dropdown
          placement="bottomRight"
          trigger={[ 'click' ]}
          overlay={notificationBox.value}
          overlayClassName={`wd-pro-dropdown-container ${styles.popover}`}
          onVisibleChange={() => onChange}
        >
          {trigger.value}
        </a-dropdown>
      )
    }
  }
})

NoticeIcon.defaultProps = {
  emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg'
}

NoticeIcon.Tab = NoticeList

export default NoticeIcon
