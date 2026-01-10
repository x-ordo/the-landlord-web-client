import { useState } from 'react'
import { BuildingRenderer } from './components/buildings'

export function BuildingTest() {
  const [level, setLevel] = useState(1)
  const [celebrating, setCelebrating] = useState(false)
  const [buildingType, setBuildingType] = useState<'residential' | 'commercial' | 'industrial'>('residential')

  const handleUpgrade = () => {
    setCelebrating(true)
    setLevel(prev => prev + 1)
    window.setTimeout(() => setCelebrating(false), 1500)
  }

  return (
    <div style={{ padding: 40, background: 'var(--bg)', minHeight: '100vh' }}>
      <h1 style={{ color: 'var(--fg)', marginBottom: 24 }}>Building Visualization Test</h1>

      {/* Controls */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => setLevel(1)}>Level 1</button>
        <button className="btn" onClick={() => setLevel(5)}>Level 5</button>
        <button className="btn" onClick={() => setLevel(10)}>Level 10</button>
        <button className="btn" onClick={() => setLevel(20)}>Level 20</button>
        <button className="btn gold" onClick={handleUpgrade}>Upgrade (+1)</button>
      </div>

      <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
        <button
          className="btn"
          onClick={() => setBuildingType('residential')}
          style={{ borderColor: buildingType === 'residential' ? 'var(--neon-blue)' : undefined }}
        >
          Residential
        </button>
        <button
          className="btn"
          onClick={() => setBuildingType('commercial')}
          style={{ borderColor: buildingType === 'commercial' ? 'var(--gold)' : undefined }}
        >
          Commercial
        </button>
        <button
          className="btn"
          onClick={() => setBuildingType('industrial')}
          style={{ borderColor: buildingType === 'industrial' ? 'var(--red)' : undefined }}
        >
          Industrial
        </button>
      </div>

      {/* Building Display */}
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {/* Small */}
        <div style={{ textAlign: 'center' }}>
          <BuildingRenderer
            level={level}
            size="sm"
            showLevel
            animated
            celebrating={celebrating}
            buildingType={buildingType}
          />
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>Small (48px)</p>
        </div>

        {/* Medium */}
        <div style={{ textAlign: 'center' }}>
          <BuildingRenderer
            level={level}
            size="md"
            showLevel
            animated
            celebrating={celebrating}
            buildingType={buildingType}
          />
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>Medium (96px)</p>
        </div>

        {/* Large */}
        <div style={{ textAlign: 'center' }}>
          <BuildingRenderer
            level={level}
            size="lg"
            showLevel
            animated
            celebrating={celebrating}
            buildingType={buildingType}
          />
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>Large (144px)</p>
        </div>
      </div>

      {/* All Building Types Preview */}
      <h2 style={{ color: 'var(--fg)', marginTop: 48, marginBottom: 24 }}>All Building Types</h2>
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ textAlign: 'center' }}>
          <BuildingRenderer level={2} size="lg" showLevel animated buildingType={buildingType} />
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>House (Lv.1-4)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <BuildingRenderer level={7} size="lg" showLevel animated buildingType={buildingType} />
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>Villa (Lv.5-9)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <BuildingRenderer level={15} size="lg" showLevel animated buildingType={buildingType} />
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>Apartment (Lv.10-19)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <BuildingRenderer level={25} size="lg" showLevel animated buildingType={buildingType} />
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>Skyscraper (Lv.20+)</p>
        </div>
      </div>
    </div>
  )
}
