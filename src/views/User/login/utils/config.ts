import {CSSProperties} from "vue";

export const  loginContainerCSS: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'auto',
  background: '#F0F2F5'
}

export const  contentCSS: CSSProperties = {
  flex: 1,
  padding: '32px 0'
}

export const  loginFormContainerCSS: CSSProperties = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  height: '100%',
  padding: '32px 0',
  overflow: 'auto',
  background: 'inherit',
  marginTop: '40px'
}

export const  loginFormContainerTopCSS: CSSProperties = {
  textAlign: 'center',
  marginBottom: '40px'
}

export const  loginFormContainerTopHeaderCSS: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '44px',
  lineHeight: '44px'
}

export const  loginFormContainerTopHeaderLogoCSS: CSSProperties = {
  width: '44px',
  height: '44px',
  marginRight: '16px',
  verticalAlign: 'top'
}

export const  loginFormContainerTopHeaderTitleCSS: CSSProperties = {
  position: 'relative',
  top: '2px',
  color: '#000000',
  fontWeight: 600,
  fontSize: '33px'
}
export const  loginFormContainerMainCSS: CSSProperties = {
  width: '328px',
  margin: '0 auto'
}
