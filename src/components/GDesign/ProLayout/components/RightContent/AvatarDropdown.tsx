import type { FunctionalComponent as FC, VNode } from 'vue'
import { cloneVNode } from 'vue'
import { Dropdown, Menu, Avatar } from 'ant-design-vue'
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
    <span class="gx-pro-right-content-action">
      <Dropdown
        overlay={
          <Menu>
            {extra && (
              extra.map((child: VNode, index) => {
                const newChild = cloneDeep(child)
                const handleChildClick = child?.['props']?.onClick
                if (child?.['props']?.onClick) delete child?.['props']?.onClick
                return (
                  <Menu.Item key={index} onClick={() => handleChildClick()}>
                    {cloneVNode(newChild)}
                  </Menu.Item>
                )
              })
            )}
            <Menu.Item key={extra ? extra.length : 0} onClick={onLogout}>
              <a href="javascript:">
                <LogoutOutlined />
                <span>退出登录</span>
              </a>
            </Menu.Item>
          </Menu>
        }
      >
        <span class="gx-pro-dropdown">
          <Avatar
            src={avatar}
            size="small"
            class="gx-pro-global-header-account-avatar"
          />
          <span class="gx-pro-global-header-account-name">{userName}</span>
        </span>
      </Dropdown>
    </span>
  )
}

export default AvatarDropdown
