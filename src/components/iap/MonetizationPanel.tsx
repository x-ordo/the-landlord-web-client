import { useGame } from '../../context/GameContext'
import { Button, Card } from '../common'

export function MonetizationPanel() {
  const { state, actions } = useGame()

  return (
    <Card>
      <div className="h2" style={{ marginBottom: 12 }}>상점 & 광고</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>💎 특별 혜택 (IAP)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Button
              onClick={() => actions.purchase('shield_24h')}
              disabled={state.busy}
              variant="primary"
            >
              24시간 보호막
            </Button>
            <Button
              onClick={() => actions.purchase('auto_collect_7d')}
              disabled={state.busy}
              variant="primary"
            >
              7일 자동수거
            </Button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>📺 광고 보고 보상 받기</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button
              onClick={() => actions.playAd('tax_discount')}
              disabled={state.busy}
            >
              세금 감면 (즉시 골드)
            </Button>
            <Button
              onClick={() => actions.playAd('defense_token')}
              disabled={state.busy}
            >
              방어 토큰 (보호막 1시간 연장)
            </Button>
            <Button
              onClick={() => actions.playAd('boost_1h')}
              disabled={state.busy}
            >
              1시간 부스트 (대량 골드)
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
