export type BindElement = HTMLElement | Window | null | undefined;
export type Rect = ClientRect | DOMRect;

export function getTargetRect(target: BindElement): ClientRect {
  return target !== window
    ? (target as HTMLElement).getBoundingClientRect()
    : ({ top: 0, bottom: window.innerHeight } as ClientRect);
}

export function getFixedTop(
  placeholderReact: Rect,
  targetRect: Rect,
  offsetTop: number | undefined,
  fixedHeader: boolean,
) {
  const targetRectTop = fixedHeader ? targetRect.top + 46 : targetRect.top
  if (offsetTop !== undefined && targetRectTop > placeholderReact.top - offsetTop) {
    return `${offsetTop + targetRectTop}px`;
  }
  return undefined;
}

export function getFixedBottom(
  placeholderReact: Rect,
  targetRect: Rect,
  offsetBottom: number | undefined,
) {
  if (offsetBottom !== undefined && targetRect.bottom < placeholderReact.bottom + offsetBottom) {
    const targetBottomOffset = window.innerHeight - targetRect.bottom;
    return `${offsetBottom + targetBottomOffset}px`;
  }
  return undefined;
}
