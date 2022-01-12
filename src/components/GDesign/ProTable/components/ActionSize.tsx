import type { FunctionalComponent } from 'vue'
import { ref } from 'vue'
import { ColumnHeightOutlined } from '@ant-design/icons-vue'

type ActionSizeProps = {
  size: string;
  className: string;
  onInput: (key: string) => void;
}

export const ActionSize: FunctionalComponent<ActionSizeProps> = (props, { attrs }) => {
  const { size = 'middle', className, onInput } = props

  const root: any = ref(null)

  const menuSlot = () => (
    <a-menu style={{ width: '80px' }} selectedKeys={[size]} onClick={({ key }) => onInput(key) }>
      <a-menu-item key="default">
        默认
      </a-menu-item>
      <a-menu-item key="middle">
        中等
      </a-menu-item>
      <a-menu-item key="small">
        紧密
      </a-menu-item>
    </a-menu>
  )

  return (
    <div
      class={{
        [`${className}-action-size`]: true,
        [`${attrs.class}`]: attrs.class
      }}
      ref={e => root.value = e}
    >
      <a-tooltip title="密度">
        <a-dropdown
          placement="bottomLeft"
          trigger={[ 'click' ]}
          get-popup-container={() => root.value}
          overlay={menuSlot()}
        >
          <ColumnHeightOutlined class={`${className}-action-icon`} />
        </a-dropdown>
      </a-tooltip>
    </div>
  )
}
