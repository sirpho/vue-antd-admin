import type { FunctionalComponent } from 'vue'
import { defineComponent, PropType, reactive, ref, Ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import {
  CloseOutlined,
  SettingOutlined,
  NotificationOutlined,
  CopyOutlined
} from '@ant-design/icons-vue'
import config from '/config/config'
// import { themeConfig } from '/config/default/themeColor'
import { PropTypes } from '/@/utils'
import clip from '/@/utils/clipboard'
import { getPrefixCls } from '@wd-design/pro-utils'
import BlockCheckbox from './BlockCheckbox'
// import ThemeColor from './ThemeColor'
import LayoutSetting, { renderLayoutSettingItem } from './LayoutChange'
import { ProSettingsProps } from '../../defaultSettings'

const { defaultSettings, animate } = config

const { preset } = animate

export const settingDrawerProps = {
  hideLoading: PropTypes.bool,
  root: PropTypes.string.def(defaultSettings.viewScrollRoot),
  settings: Object as PropType<ProSettingsProps>
}

const Body: FunctionalComponent<{ title: string; className: string }> = ({
  title = '',
  className = ''
}, { slots }) => {

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 class={`${className}-title`}>{title}</h3>
      {slots.default?.()}
    </div>
  )
}

const updateTheme = (
  dark: boolean,
  color?: string,
  hideMessageLoading?: boolean
) => {

  let hide: any = () => null
  if (!hideMessageLoading) {
    hide = message.loading('正在加载主题')
  }

  document.documentElement.className = color

  // 模拟加载主题
  setTimeout(() => hide(), 500)

  localStorage.setItem('wd-theme', dark ? 'dark' : 'light')
}

const SettingDrawer = defineComponent({
  props: settingDrawerProps,
  emits: [ 'change' ],
  setup(props, { emit, slots }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'setting-drawer'
    })

    const show: Ref<boolean> = ref(false)

    const innerHeight: Ref<number> = ref(window.innerHeight)

    watch(innerHeight, (value: number) => {
      innerHeight.value = value
    })

    const iconStyle = reactive({
      color: '#fff',
      fontSize: 20
    })

    const genCopySettingJson = (settings) => JSON.stringify(settings)

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

    const changeSetting = (type: string, value: string | boolean, hideMessageLoading?: boolean) => {

      if (type === 'primaryColor') {
        updateTheme(
          value === 'realDark',
          value as string,
          !!hideMessageLoading
        )
      }

      emit('change', { type, value })
    }

    return () => {
      const { root, settings, hideLoading } = props

      const {
        theme,
        // primaryColor,
        layout,
        fixedHeader,
        fixSiderbar,
        showTabsBar,
        fixedMultiTab,
        showProgressBar,
        animate
      } = settings as ProSettingsProps

      return (
        <a-drawer
          visible={show.value}
          width={300}
          bodyStyle={{ padding: 0 }}
          onClose={() => setShow(false)}
          placement="right"
          getContainer={document.querySelector(root) as HTMLInputElement}
          style={{
            zIndex: 1001
          }}
          handle={
            <div class={`${baseClassName}-handle`} onClick={() => setShow(!show.value)}>
              {
                show.value
                  ? (<CloseOutlined style={iconStyle} />)
                  : (<SettingOutlined style={iconStyle} />)
              }
            </div>
          }
        >
          <div style={{ height: `${innerHeight.value}px` }}>
            <w-bars>
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

                {/*<ThemeColor*/}
                {/*  title="主题色"*/}
                {/*  className={baseClassName}*/}
                {/*  value={primaryColor}*/}
                {/*  colors={themeConfig}*/}
                {/*  onChange={(color) => {*/}
                {/*    changeSetting('primaryColor', color, hideLoading)*/}
                {/*  }}*/}
                {/*/>*/}

                <a-divider />

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
                  fixedHeader={fixedHeader}
                  fixSiderbar={fixSiderbar}
                  layout={layout}
                  onChange={({ type, value }) => {
                    changeSetting(type, value)
                  }}
                />

                <a-divider />

                <Body title="其他设置" className={baseClassName}>
                  <a-list
                    split={false}
                    renderItem={({ item }) => renderLayoutSettingItem(item)}
                    dataSource={[
                      {
                        title: '多标签',
                        action: (
                          <a-switch
                            size="small"
                            checked={!!showTabsBar}
                            onChange={(checked) => changeSetting('showTabsBar', checked)}
                          />
                        )
                      },
                      {
                        title: '固定多标签',
                        action: (
                          <a-switch
                            size="small"
                            checked={!!fixedMultiTab}
                            onChange={(checked) => changeSetting('fixedMultiTab', checked)}
                          />
                        )
                      },
                      {
                        title: '顶部进度条',
                        action: (
                          <a-switch
                            size="small"
                            checked={!!showProgressBar}
                            onChange={(checked) => changeSetting('showProgressBar', checked)}
                          />
                        )
                      }
                    ]}
                  />
                </Body>

                <a-divider />

                <Body title="页面切换动画" className={baseClassName}>
                  <a-list
                    split={false}
                    renderItem={({ item }) => renderLayoutSettingItem(item)}
                    dataSource={[
                      {
                        title: '禁用动画',
                        action: (
                          <a-switch
                            size="small"
                            checked={!animate?.disabled}
                            onChange={(checked) => changeSetting('showAnimate', checked)}
                          />
                        )
                      },
                      {
                        title: '动画效果',
                        disabled: animate?.disabled,
                        action: (
                          <a-select
                            value={animate?.name}
                            size="small"
                            disabled={animate?.disabled}
                            getPopupContainer={(trigger) => {
                              if (trigger && trigger.parentNode) {
                                return trigger.parentNode
                              }
                              return trigger
                            }}
                            onSelect={(value) => changeSetting('changeAnimateMode', value)}
                            style={{ width: '120px' }}
                          >
                            {preset.map((item: any) => (
                              <a-select-option value={item.name}>{item.alias}</a-select-option>
                            ))}
                          </a-select>
                        )
                      },
                      {
                        title: '动画方向',
                        disabled: animate?.disabled,
                        action: (
                          <a-select
                            value={animate?.direction}
                            size="small"
                            disabled={animate?.disabled}
                            getPopupContainer={(trigger) => {
                              if (trigger && trigger.parentNode) {
                                return trigger.parentNode
                              }
                              return trigger
                            }}
                            onSelect={(value) => changeSetting('changeAnimateDirections', value)}
                            style={{ width: '120px' }}
                          >
                            {
                              preset.find((el: any) => el.name === animate?.name)?.directions
                                .map((item: any) => (
                                  <a-select-option value={item}>{item}</a-select-option>
                                ))
                            }
                          </a-select>
                        )
                      }
                    ]}
                  />
                </Body>

                <a-divider />

                <a-alert
                  type="warning"
                  message={'配置栏只在开发环境用于预览，生产环境不会展现，请拷贝后手动修改配置文件'}
                  icon={(<NotificationOutlined />)}
                  showIcon
                  style={{ marginBottom: '16px' }}
                />

                <a-button
                  block
                  onClick={() => clip(genCopySettingJson({
                    theme,
                    layout,
                    fixedHeader,
                    fixSiderbar,
                    showTabsBar,
                    fixedMultiTab,
                    showProgressBar,
                    animate
                  }), '拷贝成功，请到 src/defaultSettings.js 中替换默认配置')}
                >
                  <CopyOutlined />拷贝设置
                </a-button>

                <div class={`${baseClassName}-content-footer`}>
                  {slots.default?.()}
                </div>

              </div>
            </w-bars>
          </div>
        </a-drawer>
      )
    }
  }
})

export default SettingDrawer
