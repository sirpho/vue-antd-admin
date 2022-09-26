import { UploadOutlined } from '@ant-design/icons-vue'
import { v4 } from 'uuid'
import { defineComponent, reactive } from 'vue'
import { useStoreUser } from '@/store'
import { FileUploaderProps } from '@/components/FileUploader/props'
import { UploadFile } from 'ant-design-vue/lib/upload/interface'

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
        const list = [...props.fileList]
        // 检查list里面有没有没有uid的文件
        const hasOne = list.some((item) => !item.uid)
        if (hasOne) {
          list.forEach((item) => {
            if (!item.uid) {
              item.uid = v4()
            }
          })
          if (props.onChange && typeof props.onChange === 'function') {
            props.onChange([...list] as UploadFile[])
          }
        }
        state.list = list
      }
    })

    const removeFile = (file) => {
      state.list = state.list.filter((item) => item.uid !== file.uid)
    }
    const changeFileList = ({ file, fileList }) => {
      state.list = fileList
      if (props.onChange && typeof props.onChange === 'function') {
        if (file.response && file.response.code === 0) {
          props.onChange(fileList)
        }
      }
    }
    return {
      ...toRefs(state),
      props,
      accessToken: user.accessToken,
      removeFile,
      changeFileList
    }
  },
  render() {
    const { list, accessToken, props, removeFile, changeFileList } = this
    return (
      <a-upload
        headers={{ token: accessToken }}
        name={'files'}
        action={`${import.meta.env.VITE_BASE_URL}${props.action}`}
        fileList={list}
        onRemove={removeFile}
        onChange={changeFileList}
      >
        <a-button disabled={props.disabled} size="small" icon={<UploadOutlined />}>
          上传文件
        </a-button>
      </a-upload>
    )
  }
})
