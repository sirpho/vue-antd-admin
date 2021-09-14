import {
  computed,
  CSSProperties,
  ref,
  reactive,
  cloneVNode,
  defineComponent
} from 'vue'
import { cloneDeep } from 'lodash-es'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import WTagSelectOption from './TagSelectOption'
import type { actionsTextItem } from './props'
import { tagSelectProps } from './props'
import styles from './style.module.less'

export interface TagSelectOptionProps {
  value: string | number;
  style?: CSSProperties;
  checked?: boolean;
  onChange?: (value: string | number, state: boolean) => void;
}

const WTagSelect = defineComponent({
  name: 'WTagSelect',
  props: tagSelectProps,
  emits: [ 'change', 'update:value' ],
  setup(props, { slots, emit }) {
    const expand = ref(false)

    const state = reactive({
      value: props.value
    })

    const cls = computed(() => {
      return {
        [`${styles.tagSelect}`]: true,
        [`${props.className}`]: true,
        [styles.hasExpandTag]: props.expandable,
        [styles.expanded]: expand.value
      }
    })

    const getAllTags = computed(() => {
      const childrenArray: any = getChildrenSlots.value
      const checkedTags = childrenArray
        .filter((child) => isTagSelectOption(
          child.type === 'Symbol(Fragment)' && childrenArray.length === 0
            ? child.children
            : child
        ))
        .map((child: any) => child.props.value)
      return checkedTags || []
    })

    const getChildrenSlots: any = computed(() => (
      slots.default?.().length === 1 &&
      String(slots.default?.()[0].type) === String(Symbol('Fragment'))
        ? slots.default?.()[0].children
        : slots.default?.()) || [])

    const checkedAll = computed(() => getAllTags.value.length === state.value?.length)

    const actionsText = computed(() => {
      const {
        expandText = '展开',
        collapseText = '收起',
        selectAllText = '全部'
      } = props.actionsText || {}
      return {
        expandText,
        collapseText,
        selectAllText
      } as actionsTextItem
    })

    const isTagSelectOption = (node) => {
      return node &&
        node.type &&
        (node.type.isTagSelectOption || node.type.name === 'WTagSelectOption')
    }
    const toggle = () => {
      expand.value = !expand.value
    }

    const setValue = (data) => {
      state.value = cloneDeep(data)
    }

    const onSelectAll = (checked: boolean) => {
      let checkedTags: (string | number)[] = []
      if (checked) {
        checkedTags = getAllTags.value
      }
      emit('update:value', checkedTags)
      emit('change', checkedTags)
      setValue(checkedTags)
    }

    const handleTagChange = (tag: string | number, checked: boolean) => {
      const checkedTags: (string | number)[] = [ ...(state.value || []) ]

      const index = checkedTags.indexOf(tag)
      if (checked && index === -1) {
        checkedTags.push(tag)
      } else if (!checked && index > -1) {
        checkedTags.splice(index, 1)
      }
      setValue(checkedTags)
      emit('update:value', checkedTags)
      emit('change', checkedTags)
    }

    return () => (
      <div class={cls.value} style={props.style}>
        {props.hideCheckAll ? null : (
          <a-checkable-tag checked={checkedAll.value}
            key="tag-select-__all__"
            onChange={onSelectAll}>
            {actionsText.value.selectAllText}
          </a-checkable-tag>
        )}
        {getChildrenSlots.value.map((child: any) => {
          if (isTagSelectOption(child)) {
            return cloneVNode(child, {
              key: `tag-select-${child.props.value}`,
              value: child.props.value,
              checked: state.value && state.value.indexOf(child.props.value) > -1,
              onChange: handleTagChange
            })
          }
          return child
        })}
        {props.expandable && (
          <a
            class={styles.trigger}
            onClick={() => {toggle()}}
          >
            {expand.value ? (
              <>
                {actionsText.value.collapseText} <UpOutlined />
              </>
            ) : (
              <>
                {actionsText.value.expandText}
                <DownOutlined />
              </>
            )}
          </a>
        )}
      </div>
    )
  }
})

WTagSelect.Option = WTagSelectOption

export default WTagSelect
