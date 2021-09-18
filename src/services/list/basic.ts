import request from '/@/utils/request'

export type Member = {
  avatar: string;
  name: string;
  id: string;
};

export type BasicListItemDataType = {
  id: string;
  owner: string;
  title: string;
  avatar: string;
  cover: string;
  status: 'normal' | 'exception' | 'active' | 'success' | 'all';
  percent: number;
  logo: string;
  href: string;
  body?: any;
  updatedAt: number;
  createdAt: number;
  subDescription: string;
  description: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: Member[];
};

type ParamsType = {
  pageNum?: number;
  pageSize?: number;
} & Partial<BasicListItemDataType>;

export function getBasicList(
  params: ParamsType
): Promise<{ data: BasicListItemDataType[]; }> {
  return request({
    url: '/get_basic_list',
    method: 'post',
    data: params
  })
}

export function getBasicListInfo(
  params: ParamsType
): Promise<{ data: BasicListItemDataType; }> {
  return request({
    url: '/basic_list_info',
    method: 'post',
    data: params
  })
}

export function updateBasicList(
  params: ParamsType
) {
  return request({
    url: '/rule',
    method: 'PUT',
    data: params
  })
}

export function addBasicList(
  params: ParamsType
) {
  return request({
    url: '/rule',
    method: 'POST',
    data: params
  })
}

export function removeBasicList(
  params: ParamsType
) {
  return request({
    url: '/rule',
    method: 'DELETE',
    data: params
  })
}
