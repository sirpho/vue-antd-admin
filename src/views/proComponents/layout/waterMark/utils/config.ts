interface TableListItem {
  key: number;
  name: string;
  containers: number;
  creator: string;
  status: string;
  createdAt: number;
  memo: string;
}

const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error'
}

const tableListDataSource: TableListItem[] = []

const creators = [ '付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某' ]

for (let i = 0; i < 10; i += 1) {
  tableListDataSource.push({
    key: i,
    name: 'AppName',
    containers: Math.floor(Math.random() * 20),
    creator: creators[Math.floor(Math.random() * creators.length)],
    status: valueEnum[Math.floor(Math.random() * 10) % 4],
    createdAt: Date.now() - Math.floor(Math.random() * 100000),
    memo: i % 2 === 1 ? '很长很长很长很长很长很长很长的文字要展示但是要留下尾巴' : '简短备注文案'
  })
}

export default {
  positionData: tableListDataSource,
}
