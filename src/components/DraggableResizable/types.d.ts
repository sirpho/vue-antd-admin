export interface mouseOrTouchTypes {
  start: string;
  move: string;
  stop: string;
}

export interface eventsTypes {
  mouse: mouseOrTouchTypes;
  touch: mouseOrTouchTypes;
}

export interface userSelectTypes {
  userSelect: string;
  MozUserSelect: string;
  WebkitUserSelect: string;
  MsUserSelect: string;
}

export interface stateTypes {
  root: Element | any;
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  widthTouched: boolean;
  heightTouched: boolean;
  aspectFactor: number | undefined;
  parentWidth: number;
  parentHeight: number;
  minW: number;
  minH: number;
  maxW: number;
  maxH: number;
  handle: string | null;
  enabled: boolean;
  resizing: boolean;
  dragging: boolean;
  zIndex: number;
  mouseClickPosition: positionTypes;
  bounds: boundsTypes;
}

export interface positionTypes {
  mouseX: number;
  mouseY: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface boundsTypes {
  minLeft: number | null;
  maxLeft: number | null;
  minRight: number | null;
  maxRight: number | null;
  minTop: number | null;
  maxTop: number | null;
  minBottom: number | null;
  maxBottom: number | null;
}
