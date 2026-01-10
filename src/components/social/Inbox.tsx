import { useGame } from '../../context/GameContext'
import { Card, Button } from '../common'
import { fmtGold } from '../../util'

export function Inbox() {
  const { state, actions } = useGame()

  return (
    <Card>
      <div className="h2">
        사건함 {state.inbox?.unread_count ? <span className="badge">{state.inbox.unread_count}</span> : null}
      </div>
      <div
        style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflow: 'auto' }}
      >
        {state.inbox?.items?.map((it) => {
          const attacker = String((it.payload as Record<string, unknown>)?.attacker_hash || '')
          const loot = Number((it.payload as Record<string, unknown>)?.loot_amount || 0)
          const raidId = String((it.payload as Record<string, unknown>)?.raid_id || it.id)
          return (
            <div key={it.id} className={`row ${it.read_at ? '' : 'unread'}`}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {it.type}
                </div>
                <div className="muted small" style={{ marginTop: 4 }}>
                  attacker: {attacker} · loot: {fmtGold(loot)} · id: {raidId}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Button onClick={() => actions.raid(attacker, raidId)} disabled={state.busy || !attacker}>
                  복수
                </Button>
                <Button variant="danger" onClick={() => actions.blockUser(attacker)} disabled={state.busy || !attacker}>
                  차단
                </Button>
              </div>
            </div>
          )
        })}
        {!state.inbox?.items?.length ? <div className="muted small">사건 없음</div> : null}
      </div>
    </Card>
  )
}
