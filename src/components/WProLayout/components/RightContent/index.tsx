import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { LogoutOutlined, SearchOutlined } from '@ant-design/icons-vue'
import config from '/config/config'
import { getPrefixCls } from '@wd-design/pro-utils'
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
      suffixCls: 'header-search'
    })

    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const inputRef = ref<any>()
    const searchValue = ref<string>('Wd Design')
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
      await store.dispatch('user/logout')
      if (recordRoute) {
        const fullPath = route.fullPath
        router.push(`/user/login?redirect=${fullPath}`)
      } else {
        router.push('/user/login')
      }
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
          class={[ prefixCls, 'wd-pro-right-content-action wd-pro-header-search' ]}
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
          <a-auto-complete
            key="AutoComplete"
            class={inputClass.value}
            options={[
              {
                label: <a>Wd Design</a>,
                value: 'Wd Design'
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
          </a-auto-complete>
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
