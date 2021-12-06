import { computed, defineComponent } from 'vue'
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
    <a-tooltip title={item.disabled ? item.disabledReason : ''} placement="left">
      <a-list-item actions={[ action ]}>
        <span style={{ opacity: item.disabled ? 0.5 : 1 }}>{item.title}</span>
      </a-list-item>
    </a-tooltip>
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
          <a-switch
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
          <a-switch
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
        <a-list
          split={false}
          dataSource={layoutList.value}
          renderItem={({ item }) => renderLayoutSettingItem(item)}
        />
      )
    }
  }
})

export default LayoutSetting
