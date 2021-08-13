import { PageHeaderSkeleton } from './List'

type ResultPageSkeletonProps = {
  active?: boolean;
  pageHeader?: false;
}

const ResultPageSkeleton = ({ active = true, pageHeader }: ResultPageSkeletonProps) => (
  <div style={{ width: '100%', }}>
    {pageHeader !== false && <PageHeaderSkeleton active={active} />}
    <a-card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '128px',
        }}
      >
        <w-skeleton type="avatar" active={active} propsStyle={{ marginBottom: '32px' }} size={64} />
        <w-skeleton active={active} propsStyle={{ width: '214px', marginBottom: '8px' }} />
        <w-skeleton active={active} propsStyle={{ width: '328px' }} size="small" />
        <a-space style={{ marginTop: '24px', }}>
          <w-skeleton active={active} propsStyle={{ width: '116px' }} />
          <w-skeleton active={active} propsStyle={{ width: '116px' }} />
        </a-space>
      </div>
    </a-card>
  </div>
)

export default ResultPageSkeleton
