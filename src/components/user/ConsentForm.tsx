import { useGame } from '../../context/GameContext'
import { Card, Button } from '../common'

export function ConsentForm() {
  const { state, actions } = useGame()

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 800 }}>1-Tap Consent</div>
          <div className="muted small" style={{ marginTop: 6 }}>
            서비스 이용약관 및 개인정보 처리방침에 동의합니다.
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={state.consented} onChange={(e) => actions.setConsented(e.target.checked)} />
          동의
        </label>
      </div>
      <div style={{ marginTop: 12 }}>
        <Button variant="primary" onClick={actions.boot} disabled={state.busy || !state.consented}>
          건물주 시작하기
        </Button>
      </div>
      {state.error ? (
        <div className="error" style={{ marginTop: 12 }}>
          {state.error}
        </div>
      ) : null}
    </Card>
  )
}
