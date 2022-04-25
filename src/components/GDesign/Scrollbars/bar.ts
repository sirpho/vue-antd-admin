import type { ExtractPropTypes } from 'vue'

export const barProps = {
  className: String,
  always: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: '',
  },
  ratioX: {
    type: Number,
    default: 1,
  },
  ratioY: {
    type: Number,
    default: 1,
  },
}
export type BarProps = ExtractPropTypes<typeof barProps>
