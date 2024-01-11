import type { FunctionalComponent as FC, CSSProperties } from 'vue'
import { List, Avatar } from 'ant-design-vue'
import styles from './NoticeList.module.less'

const ListItem: any = List.Item

export type NoticeIconItemType = 'notification' | 'message' | 'event'

export type NoticeIconItem = {
  props?: any
  id?: string
  extra?: string
  key?: string
  isRead?: 'Y' | 'N'
  avatar?: string
  title?: string
  status?: string
  sendTime?: string
  description?: string
  type?: NoticeIconItemType
}

export type NoticeIconTabProps = {
  count?: number
  showClear?: boolean
  showViewMore?: boolean
  style?: CSSProperties
  title: string
  tabKey: NoticeIconItemType
  onClick?: (item: NoticeIconItem) => void
  onClear?: () => void
  emptyText?: string
  clearText?: string
  viewMoreText?: string
  list: NoticeIconItem[]
  onViewMore?: (e: any) => void
}

const NoticeList: FC<NoticeIconTabProps> = ({
  list = [],
  onClick,
  onClear,
  // title,
  // onViewMore,
  emptyText,
  showClear = true
  // clearText,
  // viewMoreText,
  // showViewMore = false
}) => {
  if (!list || list.length === 0) {
    return (
      <div class={styles['notFound']}>
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          alt="not found"
        />
        <div>{emptyText}</div>
      </div>
    )
  }

  return (
    <div>
      <List
        class={styles['list']}
        dataSource={list}
        renderItem={({ item, index }) => {
          const itemCls = {
            [`${styles['item']}`]: true,
            [`${styles['read']}`]: item.isRead === 'Y'
          }
          const leftIcon = item.avatar ? (
            typeof item.avatar === 'string' ? (
              <Avatar class={styles['avatar']} src={item.avatar} />
            ) : (
              <span class={styles['iconElement']}>{item.avatar}</span>
            )
          ) : (
            <div class={styles['svgWrapper']}>
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                class="Zi Zi--Comments css-7dgah8"
                fill="#a8a8a8"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 11c0 1.79.553 3.45 1.498 4.82L2.6 18.667a.6.6 0 0 0 .751.753l3.07-.96A8.5 8.5 0 1 0 2 11Zm11.46 9.414c-.457.16-.506.794-.034.904A6.96 6.96 0 0 0 15 21.5c1.148 0 2.422-.31 3.444-.912.357-.217.658-.378 1.043-.252l1.414.42c.357.112.679-.168.574-.546l-.47-1.57a.736.736 0 0 1 .05-.632c.602-1.108.945-2.32.945-3.498 0-1.07-.248-2.11-.7-3.046-.21-.435-.815-.25-.872.23-.47 3.954-3.211 7.394-6.968 8.72Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          )

          return (
            <ListItem
              class={itemCls}
              key={item.key || index}
              onClick={() => {
                onClick?.(item)
              }}
            >
              <List.Item.Meta
                class={styles['meta']}
                avatar={leftIcon}
                title={
                  <div class={styles['title']}>
                    <div class={styles['title-main']}>{item.title}</div>
                    {item.sendTime && <div class={styles.datetime}>{item.sendTime}</div>}
                  </div>
                }
                description={
                  <div>
                    <div class={styles['description']}>{item.message}</div>
                  </div>
                }
              />
            </ListItem>
          )
        }}
      />
      <div class={styles['bottomBar']}>
        {showClear ? <div onClick={onClear}>全部已读</div> : null}
        {/*{showViewMore ? (*/}
        {/*  <div*/}
        {/*    onClick={(e) => {*/}
        {/*      if (onViewMore) {*/}
        {/*        onViewMore(e)*/}
        {/*      }*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {viewMoreText}*/}
        {/*  </div>*/}
        {/*) : null}*/}
      </div>
    </div>
  )
}

export default NoticeList
