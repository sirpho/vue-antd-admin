import request from '/@/utils/request'

export type TableListItem = {
  key: number | string;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: string;
  updatedAt: string;
  createdAt: string;
  progress: number;
};

export function rule(
  params: {
    // query
    sortOrder?: string;
    sortField?: string;
    /** 当前的页码 */
    pageNum?: number;
    /** 页面的容量 */
    pageSize?: number;
  }
): Promise<{ data: TableListItem[]; total?: number; success?: boolean; }> {
  return request({
    url: '/rule_list',
    method: 'post',
    data: params
  })
}

export function getRuleInfo(options?: { [key: string]: any }) {
  return request({
    url: '/rule_info',
    method: 'post',
    data: options
  })
}

export function updateRule(options?: { [key: string]: any }) {
  return request({
    url: '/rule',
    method: 'PUT',
    data: options
  })
}

export function addRule(options?: { [key: string]: any }) {
  return request({
    url: '/rule',
    method: 'POST',
    data: options
  })
}

export function removeRule(options?: { [key: string]: any }): Promise<Record<string, any>> {
  return request({
    url: '/rule',
    method: 'DELETE',
    data: options
  })
}
