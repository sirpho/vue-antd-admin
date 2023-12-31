import type { FunctionalComponent, Ref } from 'vue'
import { defineComponent, reactive, ref, watch } from 'vue'
import { message, Drawer, List, Switch, Button, Alert, Divider } from 'ant-design-vue'
import {
  CloseOutlined,
  SettingOutlined,
  NotificationOutlined,
  CopyOutlined
} from '@ant-design/icons-vue'
import config from '/config/config'
import { themeConfig } from '/config/default/themeColor'
import { PropTypes } from '@/utils'
import { getPrefixCls } from '@gx-admin/utils'
import BlockCheckbox from './BlockCheckbox'
import ThemeColor from './ThemeColor'
import LayoutSetting, { renderLayoutSettingItem } from './LayoutSetting'
import { ProSettingsProps } from '../../defaultSettings'
import { useClipboard } from '@vueuse/core'
const { defaultSettings } = config

export const settingDrawerProps = {
  hideLoading: PropTypes.bool,
  root: PropTypes.string.def(defaultSettings.viewScrollRoot),
  settings: Object as PropType<ProSettingsProps>
}

const Body: FunctionalComponent<{ title: string; className: string }> = (
  { title = '', className = '' },
  { slots }
) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 class={`${className}-title`}>{title}</h3>
      {slots.default?.()}
    </div>
  )
}

const updateTheme = (dark: boolean, color?: string, hideMessageLoading?: boolean) => {
  let hide: any = () => null
  if (!hideMessageLoading) {
    hide = message.loading('正在加载主题')
  }

  document.documentElement.className = color

  // 模拟加载主题
  setTimeout(() => hide(), 500)

  localStorage.setItem('gx-theme', dark ? 'dark' : 'light')
}

const SettingDrawer = defineComponent({
  props: settingDrawerProps,
  emits: ['change'],
  setup(props, { emit, slots }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'setting-drawer',
      isPor: true
    })
    const { copy } = useClipboard()

    const show: Ref<boolean> = ref(false)

    const innerHeight: Ref<number> = ref(window.innerHeight)

    watch(innerHeight, (value: number) => {
      innerHeight.value = value
    })

    const iconStyle = reactive({
      color: '#fff',
      fontSize: 20
    })

    /**
     * 复制
     */
    const handleClipboard = (settings) => {
      copy(JSON.stringify(settings))
      message.success('拷贝成功，请到 config/default/theme.js 中替换默认配置')
    }

    const getThemeList = () => {
      const themeList = [
        {
          key: 'light',
          title: '亮色菜单风格'
        },
        {
          key: 'dark',
          title: '暗色菜单风格'
        }
      ]

      return {
        themeList
      }
    }

    const setShow = (flag: boolean) => {
      show.value = flag
    }

    const changeSetting = (type: string, value: any, hideMessageLoading?: boolean) => {
      if (type === 'primaryColor') {
        updateTheme(value === 'realDark', value as string, !!hideMessageLoading)
      }

      emit('change', { type, value })
    }

    return () => {
      const { settings, hideLoading } = props

      const {
        theme,
        primaryColor,
        layout,
        splitMenus,
        fixedHeader,
        fixSiderbar,
        showTabsBar,
        showProgressBar
      } = settings as ProSettingsProps

      return (
        <Drawer
          visible={show.value}
          width={300}
          bodyStyle={{ padding: 0 }}
          onClose={() => setShow(false)}
          placement="right"
          getContainer={document.querySelector('body') as HTMLElement}
          style={{
            zIndex: 1001
          }}
          handle={
            <div class={`${baseClassName}-handle`} onClick={() => setShow(!show.value)}>
              {show.value ? (
                <CloseOutlined style={iconStyle} />
              ) : (
                <SettingOutlined style={iconStyle} />
              )}
            </div>
          }
        >
          <div style={{ height: `${innerHeight.value - 34 * 2}px` }}>
            <g-bars>
              <div class={`${baseClassName}-content`}>
                <Body title="整体风格设置" className={baseClassName}>
                  <BlockCheckbox
                    className={baseClassName}
                    list={getThemeList().themeList}
                    value={theme}
                    onChange={(val) => {
                      changeSetting('theme', val, hideLoading)
                    }}
                  />
                </Body>

                <ThemeColor
                  title="主题色"
                  className={baseClassName}
                  value={primaryColor}
                  colors={themeConfig}
                  onChange={(color) => {
                    changeSetting('primaryColor', color, hideLoading)
                  }}
                />

                <Divider />

                <Body title="导航模式" className={baseClassName}>
                  <BlockCheckbox
                    className={baseClassName}
                    value={layout}
                    onChange={(val) => {
                      changeSetting('layout', val, hideLoading)
                    }}
                  />
                </Body>

                <LayoutSetting
                  splitMenus={splitMenus}
                  fixedHeader={fixedHeader}
                  fixSiderbar={fixSiderbar}
                  layout={layout}
                  onChange={({ type, value }) => {
                    changeSetting(type, value)
                  }}
                />

                <Divider />

                <Body title="其他设置" className={baseClassName}>
                  <List
                    split={false}
                    renderItem={({ item }) => renderLayoutSettingItem(item)}
                    dataSource={[
                      {
                        title: '多标签',
                        action: (
                          <Switch
                            size="small"
                            disabled={layout === 'simple'}
                            checked={!!showTabsBar}
                            onChange={(checked) => changeSetting('showTabsBar', checked)}
                          />
                        )
                      },
                      {
                        title: '顶部进度条',
                        action: (
                          <Switch
                            size="small"
                            checked={!!showProgressBar}
                            onChange={(checked) => changeSetting('showProgressBar', checked)}
                          />
                        )
                      }
                    ]}
                  />
                </Body>

                <Divider />

                <Alert
                  type="warning"
                  message={'配置栏只在开发环境用于预览，生产环境不会展现，请拷贝后手动修改配置文件'}
                  icon={<NotificationOutlined />}
                  showIcon
                  style={{ marginBottom: '16px' }}
                />

                <Button
                  block
                  onClick={() =>
                    handleClipboard({
                      theme,
                      layout,
                      splitMenus,
                      fixedHeader,
                      fixSiderbar,
                      showTabsBar,
                      showProgressBar
                    })
                  }
                >
                  <CopyOutlined />
                  拷贝设置
                </Button>

                <div class={`${baseClassName}-content-footer`}>{slots.default?.()}</div>
              </div>
            </g-bars>
          </div>
        </Drawer>
      )
    }
  }
})

export default SettingDrawer
