export type MaterialInfo = {
  play: boolean;
  width?: number;
  height?: number;
  duration?: number;
}

export type MaterialListItem = {
  id: string;
  url: string;
  type: string;
  uploadLoading: boolean;
  uploadStatus: 'normal' | 'active' | 'success' | 'exception';
  name?: string;
  coverImg?: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
  spinning?: boolean;
  loadingText?: string;
  allowFormat?: boolean;
  allowPlay?: boolean;
  progress?: number;
  sizeSolt?: string;
}
