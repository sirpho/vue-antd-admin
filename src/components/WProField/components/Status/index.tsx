import { FunctionalComponent, CSSProperties } from 'vue'

type StatusProps = {
  className?: string;
  style?: CSSProperties;
};

/** 快捷操作，用于快速的展示一个状态 */

const Status: {
  Success: FunctionalComponent<StatusProps>;
  Error: FunctionalComponent<StatusProps>;
  Processing: FunctionalComponent<StatusProps>;
  Default: FunctionalComponent<StatusProps>;
  Warning: FunctionalComponent<StatusProps>;
  success: FunctionalComponent<StatusProps>;
  error: FunctionalComponent<StatusProps>;
  processing: FunctionalComponent<StatusProps>;
  default: FunctionalComponent<StatusProps>;
  warning: FunctionalComponent<StatusProps>;
} = {
  Success: (_, { slots }) => <a-badge status="success" text={slots.default?.()} />,
  Error: (_, { slots }) => <a-badge status="error" text={slots.default?.()} />,
  Default: (_, { slots }) => <a-badge status="default" text={slots.default?.()} />,
  Processing: (_, { slots }) => <a-badge status="processing" text={slots.default?.()} />,
  Warning: (_, { slots }) => <a-badge status="warning" text={slots.default?.()} />,
  success: (_, { slots }) => <a-badge status="success" text={slots.default?.()} />,
  error: (_, { slots }) => <a-badge status="error" text={slots.default?.()} />,
  default: (_, { slots }) => <a-badge status="default" text={slots.default?.()} />,
  processing: (_, { slots }) => <a-badge status="processing" text={slots.default?.()} />,
  warning: (_, { slots }) => <a-badge status="warning" text={slots.default?.()} />
}

export type ProFieldStatusType = keyof typeof Status;

export const ProFieldBadgeColor: FunctionalComponent<StatusProps & { color: string }> = ({
  color
}, { slots }) => <a-badge color={color} text={slots.default?.()} />

export default Status
