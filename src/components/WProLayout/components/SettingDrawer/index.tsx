import { defineComponent, FunctionalComponent, PropType, reactive, ref, Ref } from 'vue'
import { CloseOutlined, SettingOutlined } from '@ant-design/icons-vue'
import config from '/config/config'
import { getPrefixCls } from '/@/components/_util'
import BlockCheckbox from './BlockCheckbox'
import LayoutSetting, { renderLayoutSettingItem } from './LayoutChange'
import { PropTypes } from '../../utils'
import { ProSettingsProps } from '../../defaultSettings'

const { defaultSettings, animate } = config

const { preset } = animate

export const SettingDrawerProps = {
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

const SettingDrawer = defineComponent({
  props: SettingDrawerProps,
  emits: [ 'change' ],
  setup(props, { emit, slots }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'setting-drawer'
    })

    const show: Ref<boolean> = ref(false)

    const iconStyle = reactive({
      color: '#fff',
      fontSize: 20
    })

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

    const changeSetting = (type: string, value: string) => {
      emit('change', { type, value })
    }

    return () => {
      const { root, settings } = props

      const {
        theme,
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
          onClose={() => setShow(false)}
          placement="right"
          getContainer={document.querySelector(root) as HTMLInputElement}
          style={{
            zIndex: 999
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
          <w-bars>
            <div class={`${baseClassName}-content`}>
              <Body title="整体风格设置" className={baseClassName}>
                <BlockCheckbox
                  className={baseClassName}
                  list={getThemeList().themeList}
                  value={theme}
                  onChange={(val) => {
                    changeSetting('theme', val)
                  }}
                />
              </Body>

              <a-divider />

              <Body title="导航模式" className={baseClassName}>
                <BlockCheckbox
                  className={baseClassName}
                  value={layout}
                  onChange={(val) => {
                    changeSetting('layout', val)
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

              <div class={`${baseClassName}-content-footer`}>
                {slots.default?.()}
              </div>

            </div>
          </w-bars>
        </a-drawer>
      )
    }
  }
})

export default SettingDrawer
