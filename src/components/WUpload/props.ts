import PropTypes from '/@/hooks/vue-types'
import { PropType } from 'vue'
import { MaterialListItem } from './typings'

export const proUploadProps = {
  cardClassName: PropTypes.string,
  uplaodStyle: PropTypes.style,
  imageStyle: PropTypes.style.def({ width: '104px', height: '104px' }),
  // 素材上传禁止状态
  disabled: PropTypes.bool,
  // 素材展示墙
  viewUp: PropTypes.bool,
  // 是否需要展示封面图（针对不是图片类型）
  isCoverImg: PropTypes.bool,
  dataList: {
    type: Array as PropType<MaterialListItem[]>,
    default: () => []
  },
  // 封面图list，顺序和dataList对应（针对不是图片类型）
  coverDataList:{
    type: Array as PropType<string[]>,
    default: () => []
  },
  limit: PropTypes.number.def(15),
  // 限制素材类型
  fileType: PropTypes.array.def([ 'jpeg', 'png', 'jpg' ]),
  // 限制素材时长 （针对视频，音频类型）
  fileDuration: PropTypes.number,
  fileSize: PropTypes.number,
  // 是否展示添加水印按钮（针对图片，视频，音频类型）
  waterMark: PropTypes.bool,
  // 是否上传之前进行快编操作（针对图片类型）
  beforeEditable: PropTypes.bool,
  // 是否展示快编图片按钮（针对图片类型）
  editor: PropTypes.bool.def(true),
  // 是否展示删除按钮
  deleteAble: PropTypes.bool.def(true),
  // 是否展示下载按钮
  downLoadAble: PropTypes.bool.def(true),
  // 是否展示进度条
  progress: PropTypes.bool.def(true),
  wordExtra: PropTypes.VNodeChild,
  errorExtra: PropTypes.VNodeChild,
  uploadButton: PropTypes.VNodeChild,
  request: PropTypes.func,
  waterChange: PropTypes.func,
  downLoad: PropTypes.func,
  change: PropTypes.func,
  errorRequest: PropTypes.func,
  deleteBefore: PropTypes.func,
  shape: PropTypes.string.def('default')
}
