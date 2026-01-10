import { useGame } from '../../context/GameContext'
import { Button, Card } from '../common'

interface Props {
  onClose: () => void
}

export function BuildingTypeModal({ onClose }: Props) {
  const { state, actions } = useGame()

  const handleSelect = async (type: string) => {
    await actions.changeBuildingType(type)
    onClose()
  }

  const types = [
    { id: 'residential', name: '🏘️ 주거용', desc: '수익률 x1.5 | 방어력 취약 (피해 +20%)' },
    { id: 'commercial', name: '🏢 상업용', desc: '수익률 x1.0 | 표준 방어력' },
    { id: 'industrial', name: '🏭 공업용', desc: '수익률 x0.7 | 철벽 방어 (피해 -40%)' },
  ]

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20
    }}>
      <Card style={{ maxWidth: 400, width: '100%' }}>
        <div className="h2" style={{ marginBottom: 16 }}>건물 유형 변경</div>
        <div className="muted small" style={{ marginBottom: 20 }}>
          유형 변경 시 10,000 Gold가 소모됩니다.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {types.map(t => (
            <div 
              key={t.id} 
              className="row" 
              style={{ 
                cursor: 'pointer',
                borderColor: state.snapshot?.building_type === t.id ? 'var(--neon-blue)' : 'var(--line)',
                background: state.snapshot?.building_type === t.id ? 'rgba(0,217,255,0.05)' : 'transparent'
              }}
              onClick={() => handleSelect(t.id)}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{t.name} {state.snapshot?.building_type === t.id && '(현재)'}</div>
                <div className="muted small">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <Button style={{ width: '100%' }} onClick={onClose}>닫기</Button>
      </Card>
    </div>
  )
}
