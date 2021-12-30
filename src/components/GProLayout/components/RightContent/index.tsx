import { computed, defineComponent, ref, createVNode } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { AutoComplete, Modal } from 'ant-design-vue'
import { LogoutOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import config from '/config/config'
import { getPrefixCls } from '@gx-design/pro-utils'
import { globalHeaderProps } from '../GlobalHeader/props'
import AvatarDropdown from './AvatarDropdown'
import NoticeIcon from '../NoticeIcon'

export default defineComponent({
  components: { LogoutOutlined },
  props: {
    extra: globalHeaderProps.extraRightDropdownRender
  },
  setup(props) {
    const { recordRoute } = config.defaultSettings
    const prefixCls = getPrefixCls({
      suffixCls: 'header-search',
      isPor: true
    })

    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const inputRef = ref<any>()
    const searchValue = ref<string>('GX Design')
    const searchMode = ref<boolean>(false)

    const inputClass = computed(() => {
      return {
        [`${prefixCls}-input`]: true,
        [`${prefixCls}-show`]: searchMode.value
      }
    })
    const avatar = computed(() => store.getters['user/avatar'])
    const userName = computed(() => store.getters['user/loginName'])

    const logout = async () => {
      Modal.confirm({
        title: '温馨提醒',
        icon: createVNode(ExclamationCircleOutlined),
        content: '是否确认退出系统?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          return new Promise((resolve) => {
            setTimeout(resolve, 200)
            store.dispatch('user/logout').then(() => {
              if (recordRoute) {
                const fullPath = route.fullPath
                router.push(`/user/login?redirect=${fullPath}`)
              } else {
                router.push({ path: '/user/login' })
              }
            })
          })
        },
        onCancel() {}
      })
    }

    const onChange = (value: string) => {
      searchValue.value = value
    }

    const onVisibleChange = (value) => {
      searchMode.value = value
    }

    return () => (
      <a-space>
        <div
          class={[ prefixCls, 'gx-pro-right-content-action gx-pro-header-search' ]}
          onClick={() => {
            onVisibleChange(true)
            if (searchMode.value && inputRef.value) {
              inputRef.value.focus()
            }
          }}
        >
          <SearchOutlined
            key="Icon"
            style={{
              cursor: 'pointer'
            }}
          />
          <AutoComplete
            key="AutoComplete"
            class={inputClass.value}
            options={[
              {
                label: <a>GX Design</a>,
                value: 'GX Design'
              },
              {
                label: <a>Ant Design</a>,
                value: 'Ant Design'
              },
              {
                label: <a>Pro Table</a>,
                value: 'Pro Table'
              },
              {
                label: <a>Pro Layout</a>,
                value: 'Pro Layout'
              }
            ]}
            onChange={onChange}
          >
            <a-input
              size="small"
              ref={e => inputRef.value = e}
              defaultValue={searchValue.value}
              aria-label="站内搜索"
              placeholder="站内搜索"
              onBlur={() => {
                onVisibleChange(false)
              }}
            />
          </AutoComplete>
        </div>
        <NoticeIcon />
        <AvatarDropdown
          avatar={avatar.value}
          userName={userName.value}
          onLogout={logout}
          {...props}
        />
      </a-space>
    )
  }
})
