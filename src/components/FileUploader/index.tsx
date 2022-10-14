import { UploadOutlined } from '@ant-design/icons-vue'
import { v4 } from 'uuid'
import { defineComponent, reactive } from 'vue'
import { useStoreUser } from '@/store'
import { FileUploaderProps } from '@/components/FileUploader/props'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import { UploadFileStatus } from 'ant-design-vue/lib/upload/interface'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'FileUploader',
  props: FileUploaderProps,
  setup(props) {
    const user = useStoreUser()
    const state = reactive({
      list: []
    })

    watchEffect(() => {
      if (props.fileList) {
        const files = props.fileList.map((item) => ({
          uid: v4(),
          status: 'done' as UploadFileStatus,
          ...item
        }))
        // @ts-ignore
        state.list = ref<UploadProps['fileList']>(files)
      }
    })

    const handleChange = (info: UploadChangeParam) => {
      let resFileList = [...info.fileList]

      // 2. read from response and show file link
      resFileList = resFileList.map((file) => {
        if (file.response && file.response.code === 0) {
          // Component will show file.url as link
          if (file.response.data && file.response.data.length > 0) {
            file.url = file.response.data[0].url
          }
        }
        return file
      })

      state.list = resFileList

      if (info.file.status === 'done') {
        if (info.file.response && info.file.response.code !== 0) {
          message.error(info.file.response.msg || '文件上传异常！')
        }
        emit()
      }
    }

    const removeFile = (file) => {
      state.list = state.list.filter((item) => item.uid !== file.uid)
      emit()
    }

    const emit = () => {
      if (props.onChange && typeof props.onChange === 'function') {
        props.onChange(state.list.filter((item) => !!item.url))
      }
    }

    return {
      ...toRefs(state),
      props,
      accessToken: user.accessToken,
      removeFile,
      handleChange
    }
  },
  render() {
    const { list, accessToken, props, removeFile, handleChange } = this
    return (
      <a-upload
        disabled={props.disabled}
        headers={{ token: accessToken }}
        name={'files'}
        action={`${import.meta.env.VITE_BASE_URL}${props.action}`}
        fileList={list}
        onRemove={removeFile}
        onChange={handleChange}
        beforeUpload={props.beforeUpload}
      >
        {!props.disabled && (
          <a-button size="small" icon={<UploadOutlined />}>
            上传文件
          </a-button>
        )}
        {props.disabled && list.length <= 0 && <span style="color: rgba(0,0,0,.25)">暂无附件</span>}
      </a-upload>
    )
  }
})
