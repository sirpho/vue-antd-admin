import { rules, formItemLayout, personColumns } from '../utils/config'
import { useForm } from 'ant-design-vue/es/form'
import dayjs from 'dayjs'
import { defineComponent, reactive } from 'vue'
import { getInfo, queryList, saveEntity, updateEntity } from '@/services/example/language'
import { divide, multiply } from '@sirpho/utils/math'
import { useDict } from '@/hooks/web'
import { message } from 'ant-design-vue'

export default defineComponent({
  emits: ['handleOk'],
  setup(_props, { expose, emit }) {
    const state = reactive({
      modalTitle: '',
      visible: false,
      isFail: false,
      spinning: false,
      skeletonLoading: false,
      disabled: false,
      pickerVisible: false,
      type: 'watch' as 'add' | 'edit' | 'watch'
    })

    const formState: any = reactive({
      id: undefined,
      area: undefined,
      location: undefined,
      name: undefined,
      englishName: undefined,
      personType: undefined,
      desc: undefined,
      callNo: undefined,
      status: undefined,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      progress: undefined,
      money: undefined
    })
    const [personTypeList] = useDict([
      'PERSON_TYPE' // 状态列表
    ])

    const rulesRef = reactive({ ...rules })

    const { resetFields, validate, validateInfos } = useForm(formState, rulesRef)

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
     * 新增
     */
    const open = () => {
      state.modalTitle = '新增'
      state.type = 'add'
      state.disabled = false
      state.visible = true
    }

    /**
     * 编辑
     */
    const edit = async (record: any) => {
      await getDetail(record)
      state.modalTitle = '编辑'
      state.type = 'edit'
      state.disabled = false
      state.visible = true
    }

    /**
     * 查看
     */
    const watch = async (record: any) => {
      await getDetail(record)
      state.modalTitle = '查看'
      state.type = 'watch'
      state.disabled = true
      state.visible = true
    }

    /**
     * 获取数据
     */
    const getDetail = async (record: any) => {
      state.skeletonLoading = true
      const res = await getInfo(record).finally(() => {
        state.skeletonLoading = false
      })
      if (res.code === 0) {
        const result = res.data || {}
        Object.keys(formState).forEach((key) => {
          switch (key) {
            case 'progress':
              formState[key] =
                result[key] || result[key] === 0 ? multiply(result[key], 100) : undefined
              break
            default:
              formState[key] = result[key]
          }
        })
      }
    }

    /**
     * 确定
     */
    const handleOk = () => {
      validate().then(async () => {
        state.spinning = true
        let operation, params

        if (state.type === 'add') {
          operation = saveEntity
          params = { ...formState }
        } else if (state.type === 'edit') {
          operation = updateEntity
          params = { ...formState }
        }
        const res = await operation({
          ...params,
          id: state.type === 'add' ? undefined : params.id,
          progress: divide(params.progress, 100)
        }).finally(() => {
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
    }

    /**
     * 关闭弹窗
     */
    const handleCancel = () => {
      resetModalState()
    }

    /**
     * 打开选择器
     */
    const handlePick = () => {
      state.pickerVisible = true
    }

    /**
     * 选择完毕
     */
    const pickerFinish = (record: any) => {
      Object.keys(formState).forEach((key) => {
        switch (key) {
          case 'progress':
            formState[key] =
              record[key] || record[key] === 0 ? multiply(record[key], 100) : undefined
            break
          default:
            formState[key] = record[key]
        }
      })
    }

    /**
     * 暴露组件内部的方法
     */
    expose({
      open,
      edit,
      watch
    })

    return () => {
      return (
        <div>
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
                if (state.type === 'watch') {
                  return (
                    <div class="gx-pro-modal-footer">
                      <a-button key="cancel" disabled={state.spinning} onClick={handleCancel}>
                        关闭
                      </a-button>
                    </div>
                  )
                } else {
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
                      <a-button key="cancel" disabled={state.spinning} onClick={handleCancel}>
                        取消
                      </a-button>
                    </div>
                  )
                }
              }
            }}
          >
            <a-form model={formState} {...formItemLayout}>
              <a-row>
                <a-col span={24}>
                  <a-form-item label="人员" {...validateInfos.name}>
                    <a-input
                      v-model:value={formState.name}
                      readonly
                      disabled={state.disabled}
                      placeholder="请选择人员"
                      v-slots={{
                        addonAfter: () => {
                          return (
                            state.type !== 'watch' && (
                              <span style="cursor: pointer" onClick={() => handlePick()}>
                                {' '}
                                选择{' '}
                              </span>
                            )
                          )
                        }
                      }}
                    />
                  </a-form-item>
                </a-col>
                <a-col span={24}>
                  <a-form-item label="籍贯" {...validateInfos.area}>
                    <a-input
                      v-model:value={formState.area}
                      disabled={state.disabled}
                      placeholder="请填写籍贯"
                    />
                  </a-form-item>
                </a-col>
                <a-col span={24}>
                  <a-form-item label="现居住地" {...validateInfos.location}>
                    <a-input
                      v-model:value={formState.location}
                      disabled={state.disabled}
                      placeholder="请填写现居住地"
                    />
                  </a-form-item>
                </a-col>
                <a-col span={24}>
                  <a-form-item label="英文名" {...validateInfos.englishName}>
                    <a-input
                      v-model:value={formState.englishName}
                      disabled={state.disabled}
                      placeholder="请填写英文名"
                    />
                  </a-form-item>
                </a-col>
                <a-col span={24}>
                  <a-form-item label="描述" {...validateInfos.desc}>
                    <a-input
                      v-model:value={formState.desc}
                      readonly
                      disabled={state.disabled}
                      placeholder="请填写描述"
                    />
                  </a-form-item>
                </a-col>
                <a-col span={24}>
                  <a-form-item label="年月" {...validateInfos.updatedAt}>
                    <a-date-picker
                      v-model:value={formState.updatedAt}
                      show-time
                      disabled={state.disabled}
                      style="width: 100%"
                      placeholder="请选择年月"
                      format="YYYY-MM-DD HH:mm:ss"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                    />
                  </a-form-item>
                </a-col>
                <a-col span={24}>
                  <a-form-item label="人物类型" {...validateInfos.personType}>
                    <a-select
                      v-model:value={formState.personType}
                      disabled={state.disabled}
                      showSearch
                      optionFilterProp="label"
                      placeholder="请选择人物类型"
                    >
                      {unref(personTypeList).map((item) => (
                        <a-select-option key={item} value={item} label={item} name={item}>
                          {item}
                        </a-select-option>
                      ))}
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col span={24}>
                  <a-form-item label="市场占有率" {...validateInfos.progress}>
                    <a-input-number
                      v-model:value={formState.progress}
                      disabled={state.disabled}
                      placeholder="请填写市场占有率"
                      style="width: 100%"
                      addon-after="%"
                      min={0.0}
                      max={100}
                      precision={2}
                    />
                  </a-form-item>
                </a-col>
                <a-col span={24}>
                  <a-form-item label="IP价值" {...validateInfos.money}>
                    <a-input-number
                      v-model:value={formState.money}
                      disabled={state.disabled}
                      placeholder="请填写IP价值"
                      style="width: 100%"
                      addon-after="元"
                      min={0.0}
                      precision={2}
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </g-pro-modal>

          {/*<!-- 人员选择 -->*/}
          <data-picker
            key="picker"
            title="人员选择"
            columns={personColumns}
            v-model:visible={state.pickerVisible}
            operation={queryList}
            onHandleOk={(record: any) => pickerFinish(record)}
          />
        </div>
      )
    }
  }
})
