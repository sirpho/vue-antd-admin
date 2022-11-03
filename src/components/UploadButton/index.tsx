import { message } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    // 自定义上传函数
    handleImport: {
      type: Function as PropType<(value: any) => Promise<any>>
    },
    // 上传前操作
    beforeUpload: {
      type: Function as PropType<(value: any) => any>
    },
    // 导入的api
    operation: {
      type: Function as PropType<(value: any) => Promise<any>>,
      required: true
    },
    // 可选择的文件
    accept: {
      type: String,
      default:
        '.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  },
  emits: ['handleImport'],
  setup(props, { emit }) {
    const uploading = ref(false)

    const beforeUpload = (file: File) => {
      const { type } = file
      const types = props.accept.split(',')
      if (types.includes(type)) {
        return true
      } else {
        message.warning('请上传excel文件!')
        return false
      }
    }

    const handleImport = async (value: any) => {
      const formData = new FormData()
      formData.append('file', value.file)
      uploading.value = true
      const res = await props.operation(formData).finally(() => {
        uploading.value = false
      })
      emit('handleImport', res)
    }

    return () => {
      const customRequest = props.handleImport || handleImport
      const beforeFun = props.beforeUpload || beforeUpload
      return (
        <a-upload
          accept={props.accept}
          showUploadList={false}
          customRequest={customRequest}
          beforeUpload={beforeFun}
        >
          <a-button size={'small'} key="import" loading={uploading.value}>
            <upload-outlined />
            导入
          </a-button>
        </a-upload>
      )
    }
  }
})
