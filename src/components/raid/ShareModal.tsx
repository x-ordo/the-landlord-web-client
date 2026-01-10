import { useGame } from '../../context/GameContext'
import { Button } from '../common'
import * as api from '../../api'
import * as toss from '../../tossBridge'

export function ShareModal() {
  const { state, actions } = useGame()

  if (!state.shareModal) return null

  // Capture shareModal to avoid non-null assertions in async closure
  const { raidId, title, desc, ogImageUrl } = state.shareModal

  const handleShare = async () => {
    if (!state.userHash) return
    try {
      const url = `${window.location.origin}?revenge=${encodeURIComponent(String(raidId))}`
      await toss.shareLink({
        title,
        description: desc,
        url,
        ogImageUrl,
      })
      const rr = await api.shareReward(state.userHash, raidId)
      await api
        .telemetryEvent(state.userHash, 'share_reward', {
          raidId,
          granted: rr.granted,
        })
        .catch(() => {})
    } catch {
      // Error handled by context
    } finally {
      actions.closeShareModal()
      await actions.refreshAll()
    }
  }

  return (
    <div className="panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 900 }}>도발 공유(보상)</div>
          <div className="muted small" style={{ marginTop: 6 }}>
            공유하면 보상 골드 획득(raid #{state.shareModal.raidId}). 1회만 지급.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" onClick={handleShare} disabled={state.busy}>
            공유하고 보상 받기
          </Button>
          <Button onClick={actions.closeShareModal} disabled={state.busy}>
            나중에
          </Button>
        </div>
      </div>
    </div>
  )
}
