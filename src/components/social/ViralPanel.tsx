import { useGame } from '../../context/GameContext'
import { Card, Button } from '../common'

export function ViralPanel() {
  const { state, actions } = useGame()

  return (
    <Card>
      <div className="h2">바이럴</div>
      <div className="muted small">contactsViral: 24시간 1회(서버 쿨다운)</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <Button variant="primary" onClick={actions.contactsViral} disabled={state.busy}>
          친구 초대(대량)
        </Button>
        <Button onClick={actions.createInvite} disabled={state.busy}>
          채용 링크 만들기
        </Button>
      </div>
      {state.employment ? (
        <div className="muted small" style={{ marginTop: 10 }}>
          ACTIVE {state.employment.active_count} · bonus x{state.employment.bonus_multiplier.toFixed(2)}
        </div>
      ) : null}
    </Card>
  )
}
