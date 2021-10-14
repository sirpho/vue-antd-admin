declare interface Result<T = any> extends TableResult{
  code: number;
  msg?: string;
  data?: T;
}

declare interface TableResult<T = any> {
  total?: number;
  pageNum?: number;
  rows?: T;
}
