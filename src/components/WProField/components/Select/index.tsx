import type { FunctionalComponent, ExtractPropTypes, } from 'vue'
import {
  ref,
  h,
  defineComponent,
  computed,
} from 'vue'
import { cloneDeep } from 'lodash-es'
import { getPrefixCls } from '@wd-design/pro-utils'
import type {
  ProFieldRequestData,
  ProFieldValueEnumType,
  ProSchemaValueEnumObj
} from '@wd-design/pro-utils'
import { PropTypes } from '/@/utils'
import { useFetchList, ObjToMap } from './useFetchList'
import LightSelect from './LightSelect'
import SearchSelect from './SearchSelect'
import TableStatus, { ProFieldBadgeColor } from '../Status'
import type { ProFieldStatusType } from '../Status'
import { proFieldPropsType } from '../../props'

/**
 * 转化 text 和 valueEnum 通过 type 来添加 Status
 *
 * @param text
 * @param valueEnum
 * @param pure 纯净模式，不增加 status
 */
export const proFieldParsingText = (
  text: string | number | (string | number)[],
  valueEnumParams: ProFieldValueEnumType
) => {
  if (Array.isArray(text)) {
    return (
      <a-space>
        {text.map((value) => (
          <div key={value?.['value'] || value}>
            {proFieldParsingText(value, valueEnumParams)}
          </div>
        ))}
      </a-space>
    )
  }

  const valueEnum = ObjToMap(valueEnumParams)

  if (!valueEnum.has(text) && !valueEnum.has(`${text}`)) {
    // @ts-ignore
    return text?.label || text
  }

  const domText = (valueEnum.get(text) || valueEnum.get(`${text}`)) as {
    text: VueNode;
    status: ProFieldStatusType;
    color?: string;
  }

  if (!domText) {
    // @ts-ignore
    return text?.label || text
  }

  const { status, color } = domText

  const Status = TableStatus[status || 'Init']
  // 如果类型存在优先使用类型
  if (Status) {
    return <Status>{domText.text}</Status>
  }

  // 如果不存在使用颜色
  if (color) {
    return <ProFieldBadgeColor color={color}>{domText.text}</ProFieldBadgeColor>
  }
  // 什么都没有使用 text
  return domText.text || domText
}

const Highlight: FunctionalComponent<{
  label: string;
  words: string[];
}> = ({ label, words }) => {
  const REG_LIST = '.^$*+-?()[]{}\\|'
  const lightCls = getPrefixCls({
    suffixCls: 'select-item-option-content-light'
  })
  const optionCls = getPrefixCls({
    suffixCls: 'select-item-option-content'
  })
  const reg = new RegExp(
    words
      .map((word) => {
        return word
          .split('')
          .map((w) => (REG_LIST.includes(w) ? `\\${w}` : w))
          .join('')
      })
      .join('|'),
    'gi'
  )
  const token = label.replace(reg, '#@$&#')
  const elements = token.split('#').map((x) =>
    x[0] === '@'
      ? h(
        'span',
        {
          class: lightCls
        },
        x.slice(1)
      )
      : x
  )
  return h(
    'div',
    {
      class: optionCls
    },
    ...elements
  )
}

export const fieldSelectProps = {
  ...proFieldPropsType,
  text: PropTypes.string,
  valueEnum: [ Object, Map ] as PropType<ProFieldValueEnumType>,
  request: Function as PropType<ProFieldRequestData>,
  params: PropTypes.any,
  fieldProps: PropTypes.any,
  bordered: {
    type: Boolean as PropType<boolean>,
    default: undefined
  },
  id: PropTypes.string
}

export type FieldSelectProps = Partial<ExtractPropTypes<typeof fieldSelectProps>>;

const FieldSelect = defineComponent({
  props: fieldSelectProps,
  setup(props) {
    const inputRef = ref<any>()
    const keyWordsRef = ref<string>('')

    const getProps = computed(() => cloneDeep(props))

    const {
      loading,
      getResOptionsRef
    } = useFetchList(getProps)

    const optionsValueEnum = computed(() => {
      return getResOptionsRef.value?.length
        ? getResOptionsRef.value?.reduce((pre: any, cur) => {
          return { ...pre, [cur.value]: cur.label }
        }, {})
        : []
    })

    const renderRead = () => {
      const { render, valueEnum, mode, fieldProps, ...rest } = props
      // 如果有 label 直接就用 label
      // @ts-ignore
      if (rest.text?.label) {
        // @ts-ignore
        return rest.text?.label
      }

      const dom = (
        <>
          {proFieldParsingText(
            rest.text,
            ObjToMap(valueEnum || optionsValueEnum.value) as unknown as ProSchemaValueEnumObj
          )}
        </>
      )

      if (render) {
        return render(rest.text, { mode, ...fieldProps }, dom) || null
      }
      return dom
    }

    const renderSelect = () => {
      const {
        mode,
        render,
        fieldProps,
        light,
        bordered,
        id,
        label,
        placeholder,
        renderFormItem,
        ...rest
      } = props

      let dom
      if (light) {
        dom = (
          <LightSelect
            bordered={bordered}
            id={id}
            loading={loading.value}
            actionRef={e => inputRef.value = e}
            allowClear
            options={getResOptionsRef.value}
            label={label}
            placeholder={placeholder || '请选择'}
            {...fieldProps}
          />
        )
      } else {
        dom = (
          <SearchSelect
            key="SearchSelect"
            style={{
              minWidth: '100px'
            }}
            bordered={bordered}
            id={id}
            loading={loading.value}
            actionRef={e => inputRef.value = e}
            allowClear
            notFoundContent={loading.value ? <a-spin size="small" /> : fieldProps?.notFoundContent}
            optionItemRender={(item) => {
              if (typeof item.label === 'string' && keyWordsRef.value) {
                return <Highlight label={item.label} words={[ keyWordsRef.value ]} />
              }
              return item.label
            }}
            placeholder={placeholder || '请选择'}
            label={label}
            {...fieldProps}
            options={getResOptionsRef.value}
          />
        )
      }

      if (renderFormItem) {
        return renderFormItem(
          rest.text,
          { mode, ...fieldProps, options: getResOptionsRef.value },
          dom
        ) || null
      }
      return dom
    }

    return () => {
      return (
        <>
          {
            props.mode == 'read'
              ? renderRead()
              : props.mode === 'edit' || props.mode === 'update'
                ? renderSelect()
                : null
          }
        </>
      )
    }
  }
})

export default FieldSelect
