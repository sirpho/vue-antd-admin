import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'WPageLoading',
  props: {
    tip: {
      type: String,
      default: 'Loading..'
    },
    size: {
      type: String,
      default: 'large'
    }
  },
  setup(props) {
    const style: any = reactive({
      textAlign: 'center',
      background: 'rgba(0,0,0,0.6)',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1100
    })
    const spinStyle = reactive({
      position: 'absolute',
      left: '50%',
      top: '40%',
      transform: 'translate(-50%, -50%)'
    })

    return () => (
      <div style={style}>
        <a-spin size={props.size} style={spinStyle} tip={props.tip} />
      </div>
    )
  }
})
