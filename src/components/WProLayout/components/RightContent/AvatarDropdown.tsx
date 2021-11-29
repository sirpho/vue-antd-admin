import type { FunctionalComponent as FC, VNode } from 'vue'
import { cloneVNode } from 'vue'
import { cloneDeep } from 'lodash-es'
import { LogoutOutlined } from '@ant-design/icons-vue'

export type AvatarDropdownProps = {
  extra?: VueNode[];
  onLogout?: () => void;
  avatar?: string;
  userName?: string;
};

const AvatarDropdown: FC<AvatarDropdownProps> = (props: AvatarDropdownProps) => {
  const {
    extra,
    onLogout,
    avatar,
    userName
  } = props

  return (
    <span class="wd-pro-right-content-action">
      <a-dropdown
        overlay={
          <a-menu>
            {extra && (
              extra.map((child: VNode, index) => {
                const newChild = cloneDeep(child)
                const handleChildClick = child?.['props']?.onClick
                if (child?.['props']?.onClick) delete child?.['props']?.onClick
                return (
                  <a-menu-item key={index} onClick={() => handleChildClick()}>
                    {cloneVNode(newChild)}
                  </a-menu-item>
                )
              })
            )}
            <a-menu-item key={extra ? extra.length : 0} onClick={onLogout}>
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
