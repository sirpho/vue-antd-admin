import { CSSProperties, defineComponent, ExtractPropTypes } from 'vue'
import Logo from '/@/assets/logo.png'
import logoContentProps from './props'
import { CustomRender } from '../../typings'

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
    title,
    showTitle = true
  } = props
  const renderFunction = (props as any)[renderKey || '']
  if (renderFunction === false) {
    return null
  }

  const logoDom = defaultRenderLogo(logo, logoStyle)
  const titleDom = showTitle ? <h1>{title}</h1> : null

  if (typeof renderFunction === 'function') {
    return renderFunction(logoDom, props.collapsed ? null : titleDom, props)
  }
  return (
    <>
      {logoDom || null}
      {titleDom}
    </>
  )
}

export default defineComponent({
  name: 'LogoContent',
  props: logoContentProps,
  setup(props ) {

    return () => {
      const headerDom = defaultRenderLogoAndTitle(props)

      return (
        <div
          id="logo"
          class={
            [
              props.layout === 'mix' ? 'wd-pro-global-header-logo' : 'wd-pro-sider-logo',
              props.theme
            ]
          }
          style={props.showTitle ? undefined : { minWidth: 'auto' }}
          onClick={props.onMenuHeaderClick}
        >
          <a>
            {headerDom || null}
          </a>
        </div>
      )
    }
  }
})
