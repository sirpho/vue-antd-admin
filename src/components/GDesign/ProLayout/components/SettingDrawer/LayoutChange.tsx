import { computed, defineComponent } from 'vue'
import { Switch, List, Tooltip } from 'ant-design-vue'
import { PropTypes } from '/@/utils'

const LayoutSettingProps = {
  fixedHeader: PropTypes.looseBool,
  fixSiderbar: PropTypes.looseBool,
  layout: PropTypes.oneOf(['side', 'mix']),
  className: PropTypes.string
}

export const renderLayoutSettingItem = (item: any) => {
  const action = { ...item.action }
  return (
    <Tooltip title={item.disabled ? item.disabledReason : ''} placement="left">
      <List.Item actions={[ action ]}>
        <span style={{ opacity: item.disabled ? 0.5 : 1 }}>{item.title}</span>
      </List.Item>
    </Tooltip>
  )
}

const LayoutSetting = defineComponent({
  props: LayoutSettingProps,
  emits: [ 'change' ],
  setup(props, { emit }) {

    const layoutList = computed(() => [
      {
        title: '固定 Header',
        disabled: props.layout === 'mix',
        action: (
          <Switch
            size="small"
            disabled={props.layout === 'mix'}
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
      }
    ])

    const handleChange = (type: string, value: string) => {
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
