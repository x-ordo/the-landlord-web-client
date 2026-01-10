import { useGame } from '../../context/GameContext'
import { Card } from '../common'

export function BlockList() {
  const { state } = useGame()

  return (
    <Card>
      <div className="h2">차단 목록</div>
      <div
        style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflow: 'auto' }}
      >
        {state.block?.items?.map((b) => (
          <div key={b.blocked_hash} className="row">
            <div>
              <div style={{ fontWeight: 700 }}>{b.blocked_hash}</div>
              <div className="muted small">{b.reason}</div>
            </div>
          </div>
        ))}
        {!state.block?.items?.length ? <div className="muted small">비어있음</div> : null}
      </div>
    </Card>
  )
}
