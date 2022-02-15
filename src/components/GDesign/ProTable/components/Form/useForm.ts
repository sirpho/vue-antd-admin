import { reactive, watchEffect } from 'vue'

export function useForm(defaultParams: RecordType) {
  const formState = reactive({})

  watchEffect(() => {
    Object.keys(defaultParams).map(item => {
      changeFormState(item, defaultParams[item])
    })
  })

  function changeFormState(key, value) {
    formState[key] = value
  }

  return {
    formState,
    changeFormState
  }
}
