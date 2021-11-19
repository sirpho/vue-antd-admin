import { computed, defineComponent, ref, Ref, unref, watch, onMounted } from 'vue'
import { omit } from 'lodash-es'
import { Form } from 'ant-design-vue'
import type { FormProps, FormItemProps } from 'ant-design-vue'
import type { NamePath } from 'ant-design-vue/lib/form/interface'
import useMemo from '/@/hooks/core/useMemo'
import type { ProFieldValueType, SearchTransformKeyFn } from '/@/components/_util/typings'
import type { ProRequestData } from '/@/components/_util/useFetchData'
import { set } from '/@/components/_util'
import transformKeySubmitValue from '/@/components/_util/transformKeySubmitValue'
import conversionMomentValue from '/@/components/_util/conversionMomentValue'
import { useFetchData } from '/@/components/_util/useFetchData'
import { proFormProps, commonProps } from './props'
import type { SubmitterProps } from '../components/Submitter'
import type { FormInstance, ProFormInstance, FieldProps, GroupProps } from '../typings'
import { provideFieldContext } from '../FieldContext'
import { provideProFormContext } from '../ProFormContext'
import Submitter from '../components/Submitter'

export type CommonFormProps<T extends Record<string, any> = Record<string, any>,
  U extends Record<string, any> = Record<string, any>,
  > = {
  submitter?:
    | SubmitterProps<{
    form?: FormInstance<any>;
  }>
    | false;

  /**
   * 支持异步操作，更加方便
   *
   * @name 表单结束后调用
   */
  onFinish?: (formData: T) => Promise<boolean | void>;

  /** @name 获取真正的可以获得值的 from */
  formRef?: () => ProFormInstance<T> | undefined;
  /**
   * 如果为 false,会原样保存。
   *
   * @default true
   * @param 要不要值中的 Null 和 undefined
   */

  omitNil?: boolean;
  /**
   * 格式化 Date 的方式，默认转化为 string
   *
   * @see date -> YYYY-MM-DD
   * @see dateTime -> YYYY-MM-DD  HH:mm:SS
   * @see time -> HH:mm:SS
   */
  dateFormatter?: 'number' | 'string' | false;
  /** 表单初始化成功，比如布局，label等计算完成 */
  onInit?: (values: T, form: ProFormInstance<any>) => void;

  /** 发起网络请求的参数 */
  params?: U;
  /** 发起网络请求的参数,返回值会覆盖给 initialValues */
  request?: ProRequestData<T, U>;

  /** 是否回车提交 */
  isKeyPressSubmit?: boolean;

  /** 用于控制form 是否相同的key，高阶用法 */
  formKey?: string;

  /** 自动选中第一项 */
  autoFocusFirstInput?: boolean;
};

export type BaseFormProps<T = Record<string, any>> = {
  contentRender?: (
    items: VueNode[],
    submitter: VueNode | undefined,
    form: FormInstance<any>
  ) => VueNode;
  fieldProps?: FieldProps;
  /** 表单初始化完成，form已经存在，可以进行赋值的操作了 */
  onInit?: (values: T, form: ProFormInstance<any>) => void;
  formItemProps?: FormItemProps;
  groupProps?: GroupProps;
  /** 是否回车提交 */
  isKeyPressSubmit?: boolean;

  /** Form 组件的类型，内部使用 */
  formComponentType?: 'DrawerForm' | 'ModalForm' | 'QueryFilter';
} & Omit<FormProps, 'onFinish'> &
  CommonFormProps<T>;

const BaseForm = defineComponent({
  props: proFormProps,
  emits: [ 'finish', 'reset', 'init' ],
  setup(props, { slots, emit }) {
    const useForm = Form.useForm

    const loading = ref<boolean>(false)

    const getProps = computed(() => props)

    const { getResOptionsRef } = useFetchData({
      request: unref(getProps).request,
      params: unref(getProps).params
    })

    const propsFormRef = computed(() => {
      return useForm({
        ...unref(getProps).model,
        ...getResOptionsRef.value
      }, unref(getProps).rules)! || ({} as any)
    })

    const fieldsValueType = ref<Record<string,
      {
        valueType: ProFieldValueType;
        dateFormat: string;
      }>>({})
    /** 保存 transformKeyRef，用于对表单key transform */
    const transformKeyRef = ref<Record<string, SearchTransformKeyFn | undefined>>({})

    const transformKey = ref<any>()

    watch(
      () => unref(getProps).dateFormatter,
      (_) => {
        transformKey.value = (values: any, omit: boolean, parentKey?: NamePath) =>
          transformKeySubmitValue(
            conversionMomentValue(
              values,
              unref(getProps).dateFormatter,
              fieldsValueType.value,
              omit,
              parentKey
            ),
            transformKeyRef.value,
            omit
          )
      }, {
        deep: true,
        immediate: true
      }
    )

    const commonValues = useMemo(() => ({
      getFieldValue: (nameList?: NamePath) => {
        return nameList ? unref(propsFormRef).modelRef[nameList as string] : {}
      },
      getFieldsValue: (nameList?: NamePath[] | true) => {
        let values = {}
        if (typeof nameList === 'boolean' && nameList) {
          values = unref(propsFormRef).modelRef
        } else {
          Object.keys(unref(propsFormRef).modelRef).map(item => {
            if ((nameList as NamePath[]).includes(item)) {
              values[item] = unref(propsFormRef).modelRef[item]
            }
            return item
          })
        }
        return values
      }
    }), [])

    const formatValues = useMemo(
      () => ({
        /** 获取格式化之后所有数据 */
        getFieldsFormatValue: (nameList?: NamePath[] | true) => {
          return unref(transformKey)(
            commonValues.value?.getFieldsValue(nameList!),
            unref(getProps).omitNil
          )
        },
        /** 获取格式化之后的单个数据 */
        getFieldFormatValue: (nameList?: NamePath) => {
          return unref(transformKey)(
            commonValues.value?.getFieldValue(nameList!),
            unref(getProps).omitNil,
            nameList
          )
        },
        /** 校验字段后返回格式化之后的所有数据 */
        validateFieldsReturnFormatValue: async (nameList?: NamePath[]) => {
          const values = await propsFormRef.value?.validateFields(nameList)
          return unref(transformKey)(values, unref(getProps).omitNil)
        }
      }),
      [ () => unref(getProps).omitNil, () => unref(transformKey) ]
    )

    /** 利用反射把值传的到处都是，并且总是新的 */
    const responseForm = useMemo(() => {
      const response: ProFormInstance<any> = { ...propsFormRef.value }
      Object.keys(propsFormRef.value || {}).forEach((key) => {
        Object.defineProperty(response, key, {
          get: () => {
            return propsFormRef.value[key]
          }
        })
      })

      Object.keys(commonValues.value).forEach((key) => {
        Object.defineProperty(response, key, {
          get: () => {
            return commonValues.value[key]
          }
        })
      })

      Object.keys(formatValues.value).forEach((key) => {
        Object.defineProperty(response, key, {
          get: () => {
            return formatValues.value[key]
          }
        })
      })
      return response
    }, [])

    const setLoading = (value: boolean) => {
      loading.value = value
    }

    /** 计算 props 的对象 */
    const submitterProps: Ref<SubmitterProps> = useMemo(
      () => (typeof unref(getProps).submitter === 'boolean' || !unref(getProps).submitter ? {} : unref(
        getProps).submitter),
      [ () => unref(getProps).submitter ]
    )

    watch(
      () => responseForm.value,
      (val) => {
        unref(getProps).formRef?.(val)
      }, {
        deep: true,
        immediate: true
      }
    )

    onMounted(() => {
      const finalValues = unref(transformKey)(
        commonValues.value?.getFieldsValue(true),
        props.omitNil
      )
      emit('init', finalValues, responseForm.value)
    })

    /** 渲染提交按钮与重置按钮 */
    const submitterNode = useMemo(() => {
      if (props.submitter === false) return undefined
      return (
        <Submitter
          key="submitter"
          {...submitterProps.value}
          onReset={() => {
            const finalValues = unref(transformKey)(
              propsFormRef.value?.getFieldsValue(),
              props.omitNil
            )
            submitterProps.value?.onReset?.(finalValues)
            props.onReset?.(finalValues)
          }}
          form={responseForm.value as FormInstance<any>}
          submitButtonProps={{
            loading: loading.value,
            ...submitterProps.value.submitButtonProps
          }}
        />
      )
    }, [
      () => unref(getProps).submitter,
      () => submitterProps.value,
      () => responseForm.value,
      () => loading.value,
      () => unref(transformKey),
      () => unref(getProps).omitNil,
      () => unref(getProps).onReset
    ])

    const content = useMemo(() => {
      if (unref(getProps).contentRender) {
        return unref(getProps).contentRender(slots.default?.(), submitterNode.value, propsFormRef.value)
      }
      return slots.default?.()
    }, [ () => unref(getProps).contentRender, () => slots.default?.(), () => submitterNode.value ])

    const getPopupContainer = useMemo(() => {
      if (typeof window === 'undefined') return undefined
      // 如果在 drawerForm 和  modalForm 里就渲染dom到父节点里
      // modalForm 可能高度太小不适合
      if (unref(getProps).formComponentType && [ 'DrawerForm' ].includes(unref(getProps).formComponentType)) {
        return (e: HTMLElement) => e.parentNode || document.body
      }
      return undefined
    }, [ () => unref(getProps).formComponentType ])

    provideFieldContext({
      formRef: propsFormRef.value,
      fieldProps: unref(getProps).fieldProps,
      formItemProps: unref(getProps).formItemProps,
      groupProps: unref(getProps).groupProps,
      formComponentType: unref(getProps).formComponentType,
      getPopupContainer: getPopupContainer.value,
      setFieldValueType: (name, { valueType = 'text', dateFormat, transform }) => {
        if (!Array.isArray(name)) return
        transformKeyRef.value = set(transformKeyRef.value, name, transform)
        fieldsValueType.value = set(fieldsValueType.value, name, {
          valueType,
          dateFormat
        })
      }
    })

    provideProFormContext(formatValues.value)

    const renderForm = () => {
      const { omitNil, ...rest } = unref(getProps)
      return (
        <Form
          {...omit(rest, Object.keys(commonProps))}
          onFinish={async () => {
            // 没设置 onFinish 就不执行
            if (!rest.onFinish) return
            // 防止重复提交
            if (loading.value) return
            setLoading(true)
            try {
              const finalValues = unref(transformKey)(
                commonValues.value?.getFieldsValue(),
                omitNil
              )
              await emit('finish', finalValues)

              setLoading(false)
            } catch (error) {
              setLoading(false)
            }
          }}
        >
          {content.value}
        </Form>
      )
    }

    return () => {
      return (
        <>
          {
            !getResOptionsRef.value && unref(getProps).request
              ? (
                <div style={{ paddingTop: '50px', paddingBottom: '50px', textAlign: 'center' }}>
                  <a-spin />
                </div>
              )
              : renderForm()
          }
        </>
      )
    }
  }
})

export default BaseForm
