import { CSSProperties, defineComponent, ExtractPropTypes } from 'vue'
import Logo from '/@/assets/logo.png'
import { CustomRender } from '@wd-pro/pro-layout'
import logoContentProps from './props'

export type LogoContentProps = Partial<ExtractPropTypes<typeof logoContentProps>>;

export const defaultRenderLogo = (logo?: CustomRender, logoStyle?: CSSProperties): CustomRender => {
  if (!logo) {
    return null
  }
  if (typeof logo === 'string') {
    return <img src={logo} alt="logo" style={logoStyle} />
  }
  if (typeof logo === 'function') {
    return logo()
  }
  return logo
}

export const defaultRenderLogoAndTitle = (
  props: LogoContentProps,
  renderKey: string | undefined = 'headerLogoRender'
) => {
  const {
    logo = Logo,
    logoStyle,
    disabledTitle,
    title
  } = props
  const renderFunction = (props as any)[renderKey || '']
  if (renderFunction === false) {
    return null
  }

  const logoDom = defaultRenderLogo(logo, logoStyle)
  const titleDom = <h1>{title}</h1>

  if (typeof renderFunction === 'function') {
    return renderFunction(logoDom, props.collapsed ? null : titleDom, props)
  }
  return (
    <>
      {logoDom || null}
      {disabledTitle ? null : titleDom}
    </>
  )
}

export default defineComponent({
  name: 'LogoContent',
  props: logoContentProps,
  setup(props) {

    return () => {
      const headerDom = defaultRenderLogoAndTitle(props)

      return (
        <div
          id="logo"
          class={[
            props.layout === 'side' || props.drawer
              ? 'wd-pro-sider-logo'
              : 'wd-pro-global-header-logo',
            props.theme
          ]}
          style={props.disabledTitle ? { minWidth: 'auto' } : undefined}
          onClick={props.onMenuHeaderClick}
        >
          <a href="#/">
            {headerDom || null}
          </a>
        </div>
      )
    }
  }
})
