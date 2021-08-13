import { ref, onMounted } from 'vue'

export default function useMediaQuery(mediaQuery: string) {
  const isSsr = typeof window === 'undefined'

  const matches = ref(isSsr ? false : window.matchMedia(mediaQuery).matches)

  onMounted(() => {
    if (isSsr) {
      return
    }
    const mediaQueryList = window.matchMedia(mediaQuery)
    const listener = (e: any) => matches.value = e.matches
    mediaQueryList.addListener(listener)
    return () => mediaQueryList.removeListener(listener)
  })
  return matches
}
