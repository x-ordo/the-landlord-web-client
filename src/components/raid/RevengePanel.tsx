import { useGame } from '../../context/GameContext'
import { Button } from '../common'
import { fmtGold } from '../../util'

export function RevengePanel() {
  const { state, actions, computed } = useGame()

  if (!state.revengeId) return null

  if (state.revengeInfo) {
    return (
      <div className="panel danger">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 900 }}>복수 링크 감지</div>
            <div className="muted small" style={{ marginTop: 6 }}>
              attacker: {state.revengeInfo.attacker_hash} / defender: {state.revengeInfo.defender_hash} / loot:{' '}
              {fmtGold(Number(state.revengeInfo.loot_amount))}
            </div>
            {!computed.revengeAction?.ok ? (
              <div className="muted small" style={{ marginTop: 6 }}>
                불가: {computed.revengeAction?.reason}
              </div>
            ) : null}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              variant="danger"
              onClick={() =>
                state.revengeInfo && actions.raid(state.revengeInfo.attacker_hash, state.revengeInfo.raid_id)
              }
              disabled={state.busy || !computed.revengeAction?.ok}
            >
              복수하기
            </Button>
            <Button onClick={actions.closeRevenge} disabled={state.busy}>
              닫기
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="panel danger">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 900 }}>복수 링크 감지</div>
          <div className="muted small" style={{ marginTop: 6 }}>
            raid_id={state.revengeId} (조회 중/없음)
          </div>
        </div>
        <Button onClick={actions.closeRevenge} disabled={state.busy}>
          닫기
        </Button>
      </div>
    </div>
  )
}
