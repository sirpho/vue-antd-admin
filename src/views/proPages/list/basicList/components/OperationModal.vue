<template>
  <w-modal
    :title="infoParams.done ? null : `任务${infoParams.current ? '编辑' : '添加'}`"
    width="850px"
    :fixHeight="false"
    :visible="visible"
    :isFail="isFail"
    :spinning="spinning"
    :skeletonLoading="skeletonLoading"
    destroyOnClose
    @cancel="handleCancel"
  >
    <template #content>
      <a-form :model="formState" v-bind="formItemLayout">
        <a-form-item label="任务名称" v-bind="validateInfos.title">
          <a-input
            v-model:value="formState.title"
            placeholder="请输入任务名称"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="开始时间" v-bind="validateInfos.createdAt">
          <a-date-picker style="width: 100%;" showTime v-model:value="formState.createdAt" />
        </a-form-item>
        <a-form-item label="任务负责人" v-bind="validateInfos.owner">
          <a-select
            v-model:value="formState.owner"
            placeholder="请选择管理员"
            allow-clear
          >
            <a-select-option :key="item" :value="item" v-for="item in user">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="产品描述" v-bind="validateInfos.subDescription">
          <a-textarea
            v-model:value="formState.subDescription"
            :auto-size="{ minRows: 5 }"
            placeholder="请输入产品描述"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </template>
    <template #footer>
      <div class="modal-footer">
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
          v-else
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
import moment from 'moment'
import { defineComponent, reactive, toRaw, getCurrentInstance, toRefs } from 'vue'
import { Form } from 'ant-design-vue'
import type { BasicListItemDataType } from '/@/services/list/basic'
import { getBasicListInfo, updateBasicList, addBasicList } from '/@/services/list/basic'
import { hanndleField } from '/@/utils/util'
import { rules, formItemLayout, user } from '../utils/config'

interface infoParamsItem {
  done: boolean;
  current: Partial<BasicListItemDataType> | undefined;
}

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
      infoParams: {
        done: false,
        current: undefined
      } as infoParamsItem
    })
    const formState: any = reactive({
      title: '',
      createdAt: null,
      owner: undefined,
      subDescription: ''
    })
    const rulesRef = reactive({ ...rules })

    const { resetFields, validate, validateInfos } = useForm(formState, rulesRef)

    const resetModalState = () => {
      state.isFail = false
      state.spinning = false
      state.visible = false
      state.skeletonLoading = false
      state.infoParams = {
        done: false,
        current: undefined
      }
      resetFields()
    }
    const open = () => {
      state.visible = true
    }
    const edit = async (id: string, infoParams: Partial<BasicListItemDataType> | undefined) => {
      state.visible = true
      state.skeletonLoading = true
      state.infoParams.current = infoParams
      const response: any = await getBasicListInfo({
        id
      })
      if (response) {
        for (let i in response.data) {
          switch (i) {
            case 'createdAt':
              formState[i] = response.data[i] ? moment(response.data[i]) : null
              break
            case 'owner':
              formState[i] = response.data[i] || null
              break
            default:
              formState[i] = hanndleField(response.data[i], '').value
              break
          }
        }
        formState.id = id
      } else {
        state.isFail = true
        proxy.$message.error((response && response.msg) || '系统错误，请稍后再试！')
      }
      state.skeletonLoading = false
    }
    const handleOk = () => {
      validate()
        .then(async () => {
          let response
          state.spinning = true
          const params = toRaw(formState)
          params.createdAt = moment(params.createdAt).format('YYYY-MM-DD HH:mm:ss')
          if (formState.id) {
            response = await updateBasicList(toRaw(formState))
          } else {
            response = await addBasicList(toRaw(formState))
          }
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
    const handleCancel = () => {
      resetModalState()
    }
    return {
      ...toRefs(state),
      user,
      formState,
      validateInfos,
      formItemLayout,
      open,
      edit,
      handleOk,
      handleCancel,
      resetModalState
    }
  }
})
</script>

<style scoped>

</style>
