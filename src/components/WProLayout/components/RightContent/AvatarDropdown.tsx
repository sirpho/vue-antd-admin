import { FunctionalComponent as FC } from 'vue'
import { LogoutOutlined } from '@ant-design/icons-vue'

export type AvatarDropdownProps = {
  onLogout?: () => void;
  avatar?: string;
  userName?: string;
};

const AvatarDropdown: FC<AvatarDropdownProps> = (props: AvatarDropdownProps) => {
  const {
    onLogout,
    avatar,
    userName
  } = props

  return (
    <span class="wd-pro-right-content-action">
      <a-dropdown
        overlay={
          <a-menu>
            <a-menu-item key="3" onClick={onLogout}>
              <a href="javascript:">
                <LogoutOutlined />
                <span>退出登录</span>
              </a>
            </a-menu-item>
          </a-menu>
        }
      >
        <span class="wd-pro-dropdown">
          <a-avatar
            src={avatar}
            size="small"
            class="wd-pro-global-header-account-avatar"
          />
          <span class="wd-pro-global-header-account-name">{userName}</span>
        </span>
      </a-dropdown>
    </span>
  )
}

export default AvatarDropdown
