import { omit } from 'lodash-es'
import { PropTypes } from '/@/utils'
import type { KeyLabel, SelectValue } from '@gx-design/Select'
import { vcSelectProps } from '@gx-design/Select'
import { tuple } from '@gx-design/utils'

export const selectProps = {
  ...omit(vcSelectProps<SelectValue>(), [ 'inputIcon', 'mode', 'getInputElement', 'backfill' ]),
  value: {
    type: [ Array, Object, String, Number ] as PropType<SelectValue | KeyLabel | KeyLabel[]>
  },
  defaultValue: {
    type: [ Array, Object, String, Number ] as PropType<SelectValue | KeyLabel | KeyLabel[]>
  },
  notFoundContent: PropTypes.any,
  suffixIcon: PropTypes.any,
  itemIcon: PropTypes.any,
  size: PropTypes.oneOf(tuple('small', 'middle', 'large', 'default')),
  mode: PropTypes.oneOf(tuple('multiple', 'tags', 'SECRET_COMBOBOX_MODE_DO_NOT_USE')),
  bordered: PropTypes.looseBool.def(false),
  transitionName: PropTypes.string.def('slide-up'),
  choiceTransitionName: PropTypes.string.def('')
}
