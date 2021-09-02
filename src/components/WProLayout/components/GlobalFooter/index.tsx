import { computed, CSSProperties, defineComponent, VueElement } from 'vue'
import { GithubOutlined } from '@ant-design/icons-vue'
import type { WithFalse } from '../../typings'

const layoutLinks = [
  {
    key: 'Ant Design Pro',
    title: 'Ant Design Pro',
    href: 'https://pro.ant.design',
    blankTarget: true
  },
  {
    key: 'gitee',
    title: <GithubOutlined />,
    href: 'https://gitee.com/gx12358/vite-admin-pro',
    blankTarget: true
  },
  {
    key: 'Ant Design',
    title: 'Ant Design',
    href: 'https://ant.design',
    blankTarget: true
  }
]

export default defineComponent({
  props: {
    style: CSSStyleSheet as PropType<CSSProperties>,
    links: {
      type: [ Array ] as PropType<WithFalse<{
        key?: string;
        title: VueNode | String;
        href: string;
        blankTarget?: boolean;
      }[]>>,
      default: layoutLinks
    },
    copyright: {
      type: [ String, VueElement, Boolean ] as PropType<string | VueNode | boolean>,
      default: `2021 WD体验技术部出品`
    },
    className: String as PropType<string>
  },
  setup(props ) {
    const handleVisible = computed(() => {
      const { links, copyright } = props
      if (
        (links == null || links === false || (Array.isArray(links) && links.length === 0)) &&
        (copyright == null || copyright === false)
      ) {
        return false
      }
      return true
    })

    return () => (
      <>
        {
          handleVisible.value ?
            <div class={[ 'wd-pro-global-footer', props.className ]}>
              {props.links && props.links.length > 0 && (
                <div class="wd-pro-global-footer-links">
                  {props.links.map((link) => (
                    <a
                      key={link.key}
                      title={link.key}
                      target={link.blankTarget ? '_blank' : '_self'}
                      href={link.href}
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              )}
              {
                props.copyright &&
                <div class="wd-pro-global-footer-copyright">{props.copyright}</div>
              }
            </div>
            :
            null
        }
      </>
    )
  }
})
