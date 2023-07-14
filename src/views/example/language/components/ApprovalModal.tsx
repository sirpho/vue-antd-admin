import { defineComponent, reactive } from 'vue'
import { approvalRules as rules, formItemLayout } from '@/views/example/language/utils/config'
import { useForm } from 'ant-design-vue/es/form'
import { message } from 'ant-design-vue'

export default defineComponent({
  props: {
    operation: {
      type: Function as PropType<(value: any) => Promise<any>>,
      required: true
    }
  },
  emits: ['handleOk'],
  setup(props, { expose, emit }) {
    const state = reactive({
      modalTitle: '',
      visible: false,
      isFail: false,
      spinning: false,
      skeletonLoading: false,
      disabled: false,
      pickerVisible: false
    })
    const formState: any = reactive({
      id: undefined,
      isPass: 'Y',
      reason: undefined
    })

    const rulesRef = reactive({ ...rules })

    const { resetFields, validate, validateInfos, clearValidate } = useForm(formState, rulesRef)

    /**
     * 恢复数据到初始化状态
     */
    const resetModalState = () => {
      state.isFail = false
      state.spinning = false
      state.visible = false
      state.skeletonLoading = false
      resetFields()
    }

    /**
     * 审核
     * @param id
     */
    const audit = async (id) => {
      state.modalTitle = '审核'
      formState.id = id
      formState.isPass = 'Y'
      setReasonRules()
      state.visible = true
    }

    /**
     * 提交
     */
    const handleOk = () => {
      validate()
        .then(async () => {
          state.spinning = true
          const params = {
            id: formState.id,
            reason: formState.reason,
            isPass: formState.isPass
          }
          const res = await props.operation(params).finally(() => {
            state.spinning = false
          })
          if (res && res.code === 0) {
            message.success('操作成功！')
            emit('handleOk')
            handleCancel()
          } else {
            message.error(res.msg || '操作异常！')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
    /**
     * 关闭弹窗
     */
    const handleCancel = () => {
      resetModalState()
    }

    /**
     * 设置审批意见的必填状态
     */
    const setReasonRules = () => {
      rulesRef.reason[0].required = formState.isPass !== 'Y'
      clearValidate('reason')
    }

    expose({
      audit
    })

    return () => {
      return (
        <g-pro-modal
          title={state.modalTitle}
          visible={state.visible}
          isFail={state.isFail}
          spinning={state.spinning}
          skeletonLoading={state.skeletonLoading}
          onCancel={() => handleCancel()}
          type="normal"
          width="600px"
          v-slots={{
            footer: () => {
              return (
                <div class="gx-pro-modal-footer">
                  <a-button
                    loading={state.spinning}
                    key="submit"
                    type="primary"
                    onClick={() => handleOk()}
                  >
                    确定
                  </a-button>
                  <a-button key="cancel" disabled={state.spinning} onClick={() => handleCancel()}>
                    取消
                  </a-button>
                </div>
              )
            }
          }}
        >
          <a-form model={formState} {...formItemLayout}>
            <a-row>
              <a-col span={24}>
                <a-form-item label="是否通过" {...validateInfos.isPass}>
                  <a-radio-group v-model:value={formState.isPass} onChange={setReasonRules}>
                    <a-radio-button value="Y">通过</a-radio-button>
                    <a-radio-button value="N">驳回</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col span={24}>
                <a-form-item label="审批意见" {...validateInfos.reason}>
                  <a-textarea
                    v-model:value={formState.reason}
                    auto-size={{ minRows: 2 }}
                    placeholder="请输入审批意见"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </g-pro-modal>
      )
    }
  }
})
