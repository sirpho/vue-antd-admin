import { defineComponent, PropType, SetupContext, VNodeChild } from 'vue'
import { GithubOutlined } from '@ant-design/icons-vue'
import { getPrefixCls } from '@gx-admin/utils'

export type Links = WithFalse<{
  key?: string;
  title: VNodeChild | JSX.Element;
  href: string;
  blankTarget?: boolean;
}[]>;

export interface GlobalFooterProps {
  links?: Links;
  copyright?: VNodeChild | JSX.Element;
  prefixCls?: string;
}

const defaultLinks = [
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
  name: 'GlobalFooter',
  props: {
    links: {
      type: [ Array, Boolean ] as PropType<Links>,
      default: defaultLinks
    },
    copyright: {
      type: [ String, Object, Function ] as PropType<VNodeChild | JSX.Element>,
      default: '2021 GX12358体验技术部出品'
    },

  },
  setup(props: GlobalFooterProps, { slots }: SetupContext) {
    if (
      (props.links == null ||
        props.links === false ||
        (Array.isArray(props.links) && props.links.length === 0)) &&
      (props.copyright == null || props.copyright === false)
    ) {
      return null
    }

    const baseClassName = getPrefixCls({
      suffixCls: 'global-footer',
      isPor: true
    })

    const copyright = props.copyright || (slots.copyright && slots.copyright())

    return () => (
      <footer class={baseClassName}>
        {props.links && (
          <div class={`${baseClassName}-links`}>
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
        {props.copyright && (
          <div class={`${baseClassName}-copyright`}>
            {copyright}
          </div>
        )}
      </footer>
    )
  }
})
