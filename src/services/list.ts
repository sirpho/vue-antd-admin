import request from '/@/utils/request'

export type Member = {
  avatar: string;
  name: string;
  id: string;
}

export interface Params {
  count: number;
}

export interface ListItemDataType {
  id: string;
  owner: string;
  title: string;
  avatar: string;
  cover: string;
  status: 'normal' | 'exception' | 'active' | 'success';
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
}

export function queryFakeList(params: Params): Promise<{ data: { list: ListItemDataType[] } }> {
  return request({
    url: '/fake_list',
    method: 'post',
    params
  })
}
