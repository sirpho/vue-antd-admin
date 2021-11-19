import { FunctionalComponent } from 'vue'
import omit from 'omit.js'
import type { ButtonProps } from 'ant-design-vue'
import type { FormInstance } from '../../typings'

export type SearchConfig = {
  /** @name 重置按钮的文本 */
  resetText?: VueNode;
  /** @name 提交按钮的文本 */
  submitText?: VueNode;
};

export type SubmitterProps<T = Record<string, any>> = {
  /** @name 提交方法 */
  onSubmit?: (value?: T) => void;
  /** @name 重置方法 */
  onReset?: (value?: T) => void;
  /** @name 搜索的配置，一般用来配置文本 */
  searchConfig?: SearchConfig;
  /** @name 提交按钮的 props */
  submitButtonProps?: false | (ButtonProps & { preventDefault?: boolean });
  /** @name 重置按钮的 props */
  resetButtonProps?: false | (ButtonProps & { preventDefault?: boolean });
  /** @name 自定义操作的渲染 */
  render?:
    | ((
    props: SubmitterProps &
      T & {
      submit: () => void;
      reset: () => void;
    },
    dom: JSX.Element[]
  ) => VueNode[] | VueNode | false)
    | false;
};

/**
 * FormFooter 的组件，可以自动进行一些配置
 *
 * @param props
 */

const Submitter: FunctionalComponent<SubmitterProps & { form: FormInstance }> = (props) => {
  if (props.render === false) {
    return null
  }

  const {
    form,
    onSubmit,
    render,
    onReset,
    searchConfig = {},
    submitButtonProps,
    resetButtonProps = {}
  } = props

  const submit = () => {
    form.submit()
    onSubmit?.()
  }

  const reset = () => {
    form.resetFields()
    onReset?.()
  }

  const {
    submitText = '提交',
    resetText = '重置'
  } = searchConfig
  /** 默认的操作的逻辑 */
  const dom = []

  if (resetButtonProps !== false) {
    dom.push(
      <a-button
        {...omit(resetButtonProps, [ 'preventDefault' ])}
        key="rest"
        onClick={(e) => {
          if (!resetButtonProps?.preventDefault) reset()
          resetButtonProps?.onClick?.(e)
        }}
      >
        {resetText}
      </a-button>
    )
  }
  if (submitButtonProps !== false) {
    dom.push(
      <a-button
        type="primary"
        {...omit(submitButtonProps || {}, [ 'preventDefault' ])}
        key="submit"
        onClick={(e) => {
          if (!submitButtonProps?.preventDefault) submit()
          submitButtonProps?.onClick?.(e)
        }}
      >
        {submitText}
      </a-button>
    )
  }

  const renderDom = render ? render({ ...props, submit, reset }, dom) : dom
  if (!renderDom) {
    return null
  }
  if (Array.isArray(renderDom)) {
    if (renderDom?.length < 1) {
      return null
    }
    if (renderDom?.length === 1) {
      return renderDom[0] as JSX.Element
    }
    return <a-space>{renderDom}</a-space>
  }
  return renderDom as JSX.Element
}

export default Submitter
