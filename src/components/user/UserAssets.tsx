import { useState, useRef, useCallback } from 'react'
import { useGame } from '../../context/GameContext'
import { Card, Button, AnimatedGold } from '../common'
import { BuildingRenderer } from '../buildings'
import { fmtGold } from '../../util'
import { BuildingTypeModal } from './BuildingTypeModal'
import type { GameBuildingType } from '../buildings'

export function UserAssets() {
  const { state, actions, computed } = useGame()
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const prevLevelRef = useRef(state.snapshot?.building_level ?? 0)

  const handleUpgrade = useCallback(async () => {
    const prevLevel = state.snapshot?.building_level ?? 0
    prevLevelRef.current = prevLevel
    await actions.upgrade()
  }, [state.snapshot?.building_level, actions])

  // Check for level up after state update
  if (state.snapshot && state.snapshot.building_level > prevLevelRef.current && !celebrating) {
    setCelebrating(true)
    prevLevelRef.current = state.snapshot.building_level
    window.setTimeout(() => setCelebrating(false), 1500)
  }

  if (!state.snapshot) return null

  const buildingTypeLabel = {
    residential: '🏘️ 주거용',
    commercial: '🏢 상업용',
    industrial: '🏭 공업용',
  }[state.snapshot.building_type] || '🏠 기본'

  return (
    <Card>
      {/* Building visualization with asset info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <BuildingRenderer
          level={state.snapshot.building_level}
          size="md"
          showLevel
          animated
          celebrating={celebrating}
          buildingType={state.snapshot.building_type as GameBuildingType}
        />

        <div style={{ flex: 1 }}>
          <div className="space" style={{ marginBottom: 8 }}>
            <div className="h2">내 자산</div>
            <span className="badge" style={{ borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)' }}>
              {buildingTypeLabel}
            </span>
          </div>
          <div className="big">
            <AnimatedGold value={computed.assets} />
          </div>
          <div className="muted small" style={{ marginTop: 6 }}>
            gold <AnimatedGold value={state.snapshot.gold} /> · lvl {state.snapshot.building_level} · gps {fmtGold(state.snapshot.gps)}
            {computed.effectiveGps > state.snapshot.gps ? (
              <span style={{ color: 'var(--neon-blue)', fontWeight: 700 }}> (x{(computed.effectiveGps / state.snapshot.gps).toFixed(2)})</span>
            ) : null}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {state.snapshot.shield_until && new Date(state.snapshot.shield_until) > new Date() ? (
          <span className="badge danger">🛡️ 보호막 (~{new Date(state.snapshot.shield_until).toLocaleTimeString()})</span>
        ) : null}
        {state.snapshot.auto_collect_until && new Date(state.snapshot.auto_collect_until) > new Date() ? (
          <span className="badge primary">🤖 자동수거 (~{new Date(state.snapshot.auto_collect_until).toLocaleDateString()})</span>
        ) : null}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button variant="gold" onClick={actions.collect} disabled={state.busy}>
          월세 징수
        </Button>
        <Button onClick={handleUpgrade} disabled={state.busy}>
          건물 업그레이드
        </Button>
        <Button onClick={() => setShowTypeModal(true)} disabled={state.busy}>
          유형 변경
        </Button>
      </div>

      {showTypeModal && <BuildingTypeModal onClose={() => setShowTypeModal(false)} />}
    </Card>
  )
}
