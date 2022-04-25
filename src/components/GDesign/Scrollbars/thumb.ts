import type { ExtractPropTypes } from 'vue'

export const thumbProps = {
  className: String,
  vertical: Boolean,
  size: String,
  move: Number,
  ratio: {
    type: Number,
    required: true,
  },
  always: Boolean,
}
export type ThumbProps = ExtractPropTypes<typeof thumbProps>
