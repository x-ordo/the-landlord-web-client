import { useGame } from '../../context/GameContext'
import { Button } from '../common'
import * as toss from '../../tossBridge'

export function TopBar() {
  const { state, actions } = useGame()

  return (
    <header className="topbar">
      <div>
        <div className="title">갓물주 전쟁 (Week4)</div>
        <div className="muted small">user: {state.userHash || '...'}</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => actions.refreshAll()} disabled={!state.userHash || state.busy}>
          새로고침
        </Button>
        <Button variant="gold" onClick={actions.markAllRead} disabled={!state.userHash || state.busy || !state.inbox}>
          사건함 정리
        </Button>
        <Button onClick={() => toss.openLeaderboard()} disabled={!state.userHash || state.busy}>
          랭킹
        </Button>
      </div>
    </header>
  )
}
