import { cloneVNode, computed, defineComponent, ref, Teleport } from 'vue'
import ImageViewer from './ImageViewer'
import { wImagePorps } from '../props'
import { getPrefixCls } from '/@/components/_util'

let prevOverflow = ''

const WImageViewerGroup = defineComponent({
  props: {
    hideOnClickModal: wImagePorps.hideOnClickModal
  },
  setup(props, { slots }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'image-viewer-group',
      defaultPrefixCls: 'wd'
    })

    const showViewer = ref(false)
    const initialSrc = ref('')

    const getChildrenSlots: any = computed(() => slots.default?.().length === 1 &&
      (
        String(slots.default?.()[0].type) === String(Symbol('Fragment')) ||
        String(slots.default?.()[0].type) === String(Symbol())
      )
        ? slots.default?.()[0].children || []
        : slots.default?.() || []
    )

    const previewSrcList = computed(() => {
      const childrenArray: any = getChildrenSlots.value
      const checkedTags = childrenArray
        .filter((child) => isWImage(child))
        .map((child: any) => child.props.src)
        .filter((src) => src)
      return checkedTags || []
    })

    const preview = computed(() => {
      return Array.isArray(previewSrcList.value) && previewSrcList.value.length > 0
    })

    const isWImage = (node) => {
      return node &&
        node.type &&
        (node.type.isWImage || node.type.name === 'WImage')
    }

    const imageIndex = () => {
      let previewIndex = 0
      const srcIndex = previewSrcList.value.findIndex(item => item === initialSrc.value)
      if (srcIndex >= 0) {
        previewIndex = srcIndex
      }
      return previewIndex
    }

    const clickHandler = (src: string) => {
      if (!preview.value || !src) {
        return
      }
      initialSrc.value = src
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      showViewer.value = true
    }

    const closeViewer = () => {
      document.body.style.overflow = prevOverflow
      showViewer.value = false
    }

    return () => (
      <div class={`${baseClassName}`}>
        <a-space>
          {getChildrenSlots.value.map((child: any, index) => {
            if (isWImage(child)) {
              return (
                <div
                  key={index}
                  class={`${baseClassName}-item`}
                  onClick={() => clickHandler(child.props?.src || '')}
                >
                  {cloneVNode(child, {
                    disablePreview: true
                  })}
                </div>
              )
            }
            return null
          })}
        </a-space>
        <Teleport to="body">
          {preview.value && showViewer.value && (
            <ImageViewer
              initialIndex={imageIndex()}
              urlList={previewSrcList.value}
              onHideOnClickModal={props.hideOnClickModal}
              onClose={() => closeViewer()}
            />
          )}
        </Teleport>
      </div>
    )
  }
})

export default WImageViewerGroup
