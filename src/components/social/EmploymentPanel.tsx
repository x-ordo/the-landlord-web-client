import { useGame } from '../../context/GameContext'
import { Card, Button } from '../common'

export function EmploymentPanel() {
  const { state, actions } = useGame()

  const activeCount = state.employment?.active_count || 0
  const bonus = state.employment?.bonus_multiplier || 1.0
  const employees = state.employment?.employees || []

  return (
    <Card>
      <div className="h2" style={{ marginBottom: 12 }}>알바 채용 현황</div>
      
      <div className="space" style={{ background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 12, marginBottom: 16 }}>
        <div>
          <div className="muted small">수익 보너스</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--neon-blue)' }}>x{bonus.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="muted small">고용 인원</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{activeCount}명</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {employees.length === 0 ? (
          <div className="muted small" style={{ textAlign: 'center', padding: '10px 0' }}>
            고용된 알바생이 없습니다.
          </div>
        ) : (
          employees.map((emp, i) => (
            <div key={i} className="row small" style={{ padding: '8px 12px' }}>
              <span>👤 {emp.employee_hash.substring(0, 8)}...</span>
              <span className="badge primary">ACTIVE</span>
            </div>
          ))
        )}
      </div>

      <Button variant="primary" style={{ width: '100%' }} onClick={actions.createInvite} disabled={state.busy}>
        🤝 새로운 알바 초대하기
      </Button>
      <div className="muted small" style={{ marginTop: 8, textAlign: 'center' }}>
        초대를 수락하면 건물의 수익률이 영구적으로 상승합니다.
      </div>
    </Card>
  )
}
