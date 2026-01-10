import { useGame } from '../../context/GameContext'
import { Button } from '../common'

export function InvitePanel() {
  const { state, actions } = useGame()

  if (!state.inviteId) return null

  return (
    <div className="panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 800 }}>채용 초대 감지</div>
          <div className="muted small" style={{ marginTop: 6 }}>
            초대 토큰: {state.inviteId} (수락해야 알바가 됨)
          </div>
        </div>
        <Button variant="primary" onClick={actions.acceptInvite} disabled={state.busy}>
          수락하고 입주
        </Button>
      </div>
    </div>
  )
}
