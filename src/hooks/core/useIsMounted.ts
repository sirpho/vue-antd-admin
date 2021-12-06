import {
  ref,
  onMounted,
  readonly,
  Ref
} from 'vue'

export function useIsMounted(): Readonly<Ref<boolean>> {
  const isMounted = ref(false)
  onMounted(() => { isMounted.value = true })
  return readonly(isMounted)
}
