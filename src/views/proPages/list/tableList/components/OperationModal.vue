<template>
  <w-modal
    :title="modalTitle"
    :fixHeight="false"
    :visible="visible"
    :isFail="isFail"
    :spinning="spinning"
    :skeletonLoading="skeletonLoading"
    destroyOnClose
    @cancel="handleCancel"
  >
    <template #content>
      <a-form v-if="formType === 0" :model="formState" v-bind="formItemLayout">
        <a-form-item label="规则名称" v-bind="validateInfos.name">
          <a-input
            v-model:value="formState.name"
            placeholder="请输入规则名称"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="规则描述" v-bind="validateInfos.desc">
          <a-textarea
            v-model:value="formState.desc"
            :auto-size="{ minRows: 5 }"
            placeholder="请输入规则描述"
            allow-clear
          />
        </a-form-item>
      </a-form>
      <div v-else :class="$style['step-form']">
        <a-steps :current="stepCurrent">
          <a-step title="基本信息" />
          <a-step title="配置规则属性" />
          <a-step title="设定调度周期" />
        </a-steps>
        <div
          :class="{
            [`${$style['step-form-content']}`]: true,
            [`${$style['step-form-content-active']}`]: stepCurrent === 0
          }"
        >
          <a-form :model="formState" v-bind="formItemLayout">
            <a-form-item label="规则名称" v-bind="validateInfos.name">
              <a-input
                v-model:value="formState.name"
                placeholder="请输入规则名称"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="规则描述" v-bind="validateInfos.desc">
              <a-textarea
                v-model:value="formState.desc"
                :auto-size="{ minRows: 5 }"
                placeholder="请输入规则描述"
                allow-clear
              />
            </a-form-item>
          </a-form>
        </div>
        <div
          :class="{
            [`${$style['step-form-content']}`]: true,
            [`${$style['step-form-content-active']}`]: stepCurrent === 1
          }"
        >
          <a-form :model="formAttributes">
            <a-form-item label="规则名称">
              <a-select
                style="width: 100%;"
                :options="[
                  {
                    value: '0',
                    label: '表一',
                  },
                  {
                    value: '1',
                    label: '表二',
                  }
                ]"
                placeholder="请选择"
                v-model:value="formAttributes.target"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="规则描述">
              <a-select
                style="width: 100%;"
                :options="[
                  {
                    value: '0',
                    label: '规则模板一',
                  },
                  {
                    value: '1',
                    label: '规则模板二',
                  }
                ]"
                placeholder="请选择"
                v-model:value="formAttributes.template"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="规则描述">
              <a-radio-group
                :options="[
                  {
                    value: '0',
                    label: '强',
                  },
                  {
                    value: '1',
                    label: '弱',
                  }
                ]"
                v-model:value="formAttributes.type"
              />
            </a-form-item>
          </a-form>
        </div>
        <div
          :class="{
            [`${$style['step-form-content']}`]: true,
            [`${$style['step-form-content-active']}`]: stepCurrent === 2
          }"
        >
          <a-form :model="formDispatch" v-bind="formItemLayout">
            <a-form-item label="开始时间" v-bind="dispatchvalidateInfos.time">
              <a-date-picker style="width: 100%;" showTime v-model:value="formDispatch.time" />
            </a-form-item>
            <a-form-item label="监控对象" v-bind="dispatchvalidateInfos.frequency">
              <a-select
                style="width: 100%;"
                :options="[
                  {
                    value: 'month',
                    label: '月',
                  },
                  {
                    value: 'week',
                    label: '周',
                  }
                ]"
                placeholder="请选择"
                v-model:value="formDispatch.frequency"
                allow-clear
              />
            </a-form-item>
          </a-form>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="modal-footer">
        <a-button
          v-if="stepCurrent > 0 && formType === 1"
          key="back"
          @click="() => { stepCurrent -= 1 }"
        >
          上一步
        </a-button>
        <a-button
          v-if="stepCurrent < 2 && formType === 1"
          type="primary"
          key="back"
          @click="stepConfim"
        >
          下一步
        </a-button>
        <a-button
          v-if="lookUp"
          type="primary"
          key="back"
          @click="
            () => {
              this.lookUp = false
            }
          "
        >
          编辑
        </a-button>
        <a-button
          v-else-if="stepCurrent === 2 || formType === 0"
          :loading="spinning"
          key="submit"
          type="primary"
          @click="handleOk"
        >
          确定
        </a-button>
        <a-button key="cancel" :loading="spinning" @click="handleCancel">
          {{ lookUp ? '关闭' : '取消' }}
        </a-button>
      </div>
    </template>
  </w-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, toRaw, getCurrentInstance, toRefs } from 'vue'
import moment from 'moment'
import { Form } from 'ant-design-vue'
import { getRuleInfo, addRule, updateRule } from '/@/services/list/table'
import { rules, dispatchRules, formItemLayout } from '../utils/config'
import { hanndleField } from '/@/utils/util'

const useForm = Form.useForm

export default defineComponent({
  emits: [ 'handleOk' ],
  setup(_, { emit }) {
    const { proxy }: any = getCurrentInstance()
    const state = reactive({
      isFail: false,
      visible: false,
      spinning: false,
      skeletonLoading: false,
      modalTitle: '新建规则',
      formType: 0,
      stepCurrent: 0
    })
    const formState: any = reactive({
      name: '',
      desc: ''
    })
    const formAttributes = reactive({
      target: '0',
      template: '0',
      type: '1'
    })
    const formDispatch = reactive({
      time: null,
      frequency: 'month'
    })
    const rulesRef = reactive({ ...rules })
    const dispatchRuleRef = reactive({ ...dispatchRules })

    const { resetFields, validate, validateInfos } = useForm(formState, rulesRef)
    const useFormDispatch = useForm(formDispatch, dispatchRuleRef)

    const resetModalState = () => {
      state.isFail = false
      state.spinning = false
      state.visible = false
      state.skeletonLoading = false
      state.formType = 0
      state.stepCurrent = 0
      resetFields()
    }
    const open = () => {
      state.visible = true
    }
    const edit = async (key) => {
      state.modalTitle = '规则配置'
      state.formType = 1
      state.visible = true
      state.skeletonLoading = true
      const response: any = await getRuleInfo({
        key
      })
      if (response) {
        for (let i in response.data) {
          switch (i) {
            default:
              formState[i] = hanndleField(response.data[i], '').value
              break
          }
        }
        formState.key = key
      } else {
        state.isFail = true
        proxy.$message.error((response && response.msg) || '系统错误，请稍后再试！')
      }
      state.skeletonLoading = false
    }
    const stepConfim = () => {
      if (state.stepCurrent === 0) {
        validate()
          .then(() => {
            state.stepCurrent += 1
          })
          .catch(_ => {})
      } else {
        state.stepCurrent += 1
      }
    }
    const handleOk = () => {
      let response
      if (state.formType === 0) {
        validate()
          .then(async () => {
            state.spinning = true
            response = await addRule(toRaw(formState))
            if (response) {
              proxy.$message.success('操作成功！')
              emit('handleOk')
              handleCancel()
            } else {
              proxy.$message.error((response && response.msg) || '系统错误，请稍后再试！')
            }
            state.spinning = false
          })
          .catch(_ => {})
      } else {
        useFormDispatch.validate()
          .then(async () => {
            state.spinning = true
            const params = {
              ...toRaw(formState),
              ...toRaw(formAttributes),
              ...toRaw(formDispatch)
            }
            params.time = moment(params.time).format('YYYY-MM-DD HH:mm:ss')
            response = await updateRule(params)
            if (response) {
              proxy.$message.success('操作成功！')
              emit('handleOk')
              handleCancel()
            } else {
              proxy.$message.error((response && response.msg) || '系统错误，请稍后再试！')
            }
            state.spinning = false
          })
          .catch(_ => {})
      }
    }
    const handleCancel = () => {
      resetModalState()
    }
    return {
      ...toRefs(state),
      formState,
      formAttributes,
      formDispatch,
      validateInfos,
      dispatchvalidateInfos: useFormDispatch.validateInfos,
      formItemLayout,
      open,
      edit,
      stepConfim,
      handleOk,
      handleCancel,
      resetModalState
    }
  }
})
</script>

<style lang="less" module>
@import "./index";
</style>
