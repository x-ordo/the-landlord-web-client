import { useGame } from '../../context/GameContext'
import { Card, Button } from '../common'
import { fmtGold } from '../../util'

export function RaidTargets() {
  const { state, actions } = useGame()

  return (
    <Card>
      <div className="h2">약탈 타겟</div>
      <div className="muted small">차단/쿨다운/레이트리밋 반영</div>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {state.targets.map((t) => (
          <div key={t.defender_hash} className="row">
            <div>
              <div style={{ fontWeight: 700 }}>{t.defender_hash}</div>
              <div className="muted small">
                assets≈ {fmtGold(t.defender_assets)} · maxLoot≈ {fmtGold(t.max_loot_hint)}
              </div>
            </div>
            <Button variant="danger" onClick={() => actions.raid(t.defender_hash)} disabled={state.busy}>
              세무 조사
            </Button>
          </div>
        ))}
        {!state.targets.length ? <div className="muted small">타겟 없음(차단/인원 부족)</div> : null}
      </div>
    </Card>
  )
}
