import type { CSSProperties, FunctionalComponent as FC } from 'vue'
import { cloneVNode } from 'vue'
import { getSlotChildren } from '@gx-admin/utils'

import styles from './index.module.less'

export declare type SizeType = number | 'small' | 'default' | 'large';

export type AvatarItemProps = {
  tips: VueNode;
  src: string;
  size?: SizeType;
  style?: CSSProperties;
  onClick?: () => void;
}

export type AvatarListProps = {
  Item?: VueNode;
  size?: SizeType;
  maxLength?: number;
  excessItemsStyle?: CSSProperties;
  style?: CSSProperties;
}

const avatarSizeToClassName = (size?: SizeType | 'mini') => {
  return {
    [`${styles.avatarItem}`]: true,
    [`${styles.avatarItemLarge}`]: size === 'large',
    [`${styles.avatarItemSmall}`]: size === 'small',
    [`${styles.avatarItemMini}`]: size === 'mini'
  }
}

const Item: FC<AvatarItemProps> = ({ src, size, tips, onClick = () => {} }) => {
  const cls = avatarSizeToClassName(size)

  return (
    <li class={cls} onClick={onClick}>
      {tips ? (
        <a-tooltip title={tips}>
          <a-avatar src={src} size={size} style={{ cursor: 'pointer' }} />
        </a-tooltip>
      ) : (
        <a-avatar src={src} size={size} />
      )}
    </li>
  )
}

const AvatarList: FC<AvatarListProps> & { Item: typeof Item } = ({
  size,
  maxLength = 5,
  excessItemsStyle,
  ...other
}, { slots }) => {
  const children = getSlotChildren(slots)
  const numOfChildren = children.length
  const numToShow = maxLength >= numOfChildren ? numOfChildren : maxLength
  const childrenWithProps = children.slice(0, numToShow).map((child) =>
    cloneVNode(child, {
      size
    })
  )

  if (numToShow < numOfChildren) {
    const cls = avatarSizeToClassName(size)

    childrenWithProps.push(
      <li key="exceed" class={cls}>
        <a-avatar size={size} style={excessItemsStyle}>{`+${numOfChildren - maxLength}`}</a-avatar>
      </li>
    )
  }

  return (
    <div {...other} class={styles.avatarList}>
      <ul> {childrenWithProps} </ul>
    </div>
  )
}

AvatarList.Item = Item

export default AvatarList
