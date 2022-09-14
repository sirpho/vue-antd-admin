import type { Ref, ComputedRef } from 'vue'
import { inject, InjectionKey, provide } from 'vue'

export type ContextType = any;


export interface VideoContextProps {
  /* 附加属性 */
  player?: Ref<HTMLVideoElement>;
  isPlaying?: Ref<boolean>;
  fullScreen?: Ref<boolean>;
  play?: () => void;
  pause?: () => void;
  [key: string]: any;
}

const videoContextInjectKey: InjectionKey<VideoContextProps> = Symbol('video-context')

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<ContextType> = Symbol(),
  defaultValue?: ContextType
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}

export const provideVideoContext = (value: VideoContextProps | ComputedRef<VideoContextProps>) => {
  provide(videoContextInjectKey, value)
}

export const useVideoContext = () =>
  useContext<Required<VideoContextProps>>(videoContextInjectKey, [])
