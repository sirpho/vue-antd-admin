import { defineComponent, ref } from 'vue'
import { ColumnHeightOutlined } from '@ant-design/icons-vue'
import styles from '../style.module.less'

const ActionSize = defineComponent({
  props: {
    size: {
      type: String,
      required: false,
      default: 'middle'
    }
  },
  setup(props, { emit }) {
    const root: any = ref(null)
    const onClick = ({ key }) => {
      emit('input', key)
    }
    const menuSlot = () => (
      <a-menu style={{ width: '80px' }} selectedKeys={[props.size]} onClick={onClick}>
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
    return () => (
      <div class={styles['action-size']} ref={e => root.value = e}>
        <a-tooltip title="密度">
          <a-dropdown
            placement="bottomLeft"
            trigger={[ 'click' ]}
            get-popup-container={() => root.value}
            overlay={menuSlot}
          >
            <ColumnHeightOutlined class={styles.action} />
          </a-dropdown>
        </a-tooltip>
      </div>
    )
  }
})
export default ActionSize
