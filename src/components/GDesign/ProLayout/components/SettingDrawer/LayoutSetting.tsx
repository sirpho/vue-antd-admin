import { computed, defineComponent } from 'vue'
import { Switch, List, Tooltip } from 'ant-design-vue'
import { PropTypes } from '@/utils'

const LayoutSettingProps = {
  splitMenus: PropTypes.looseBool,
  fixedHeader: PropTypes.looseBool,
  fixSiderbar: PropTypes.looseBool,
  layout: PropTypes.oneOf(['side', 'mix', 'simple']),
  className: PropTypes.string
}

export const renderLayoutSettingItem = (item: any) => {
  const action = { ...item.action }
  return (
    <Tooltip title={item.disabled ? item.disabledReason : ''} placement="left">
      <List.Item actions={[action]}>
        <span style={{ opacity: item.disabled ? 0.5 : 1 }}>{item.title}</span>
      </List.Item>
    </Tooltip>
  )
}

const LayoutSetting = defineComponent({
  props: LayoutSettingProps,
  emits: ['change'],
  setup(props, { emit }) {
    const layoutList = computed(() => [
      {
        title: '固定 Header',
        disabled: props.layout === 'mix',
        action: (
          <Switch
            size="small"
            disabled={props.layout === 'mix' || props.layout === 'simple'}
            checked={!!props.fixedHeader}
            onChange={(checked) => handleChange('fixedHeader', checked)}
          />
        )
      },
      {
        title: '固定侧边菜单',
        disabled: props.layout === 'mix',
        action: (
          <Switch
            size="small"
            disabled={props.layout === 'mix'}
            checked={!!props.fixSiderbar}
            onChange={(checked) => handleChange('fixSiderbar', checked)}
          />
        )
      },
      {
        title: '自动分割菜单',
        disabled: props.layout === 'side',
        action: (
          <Switch
            size="small"
            disabled={props.layout === 'side' || props.layout === 'simple'}
            checked={!!props.splitMenus}
            onChange={(checked) => handleChange('splitMenus', checked)}
          />
        )
      }
    ])

    const handleChange = (type: string, value: boolean | string | number) => {
      emit('change', { type, value })
    }

    return () => {
      return (
        <List
          split={false}
          dataSource={layoutList.value}
          renderItem={({ item }) => renderLayoutSettingItem(item)}
        />
      )
    }
  }
})

export default LayoutSetting
