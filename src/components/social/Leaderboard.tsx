import { useGame } from '../../context/GameContext'
import { Card } from '../common'
import { fmtGold } from '../../util'

export function Leaderboard() {
  const { state } = useGame()

  if (!state.leaderboard) return null

  const { top_entries, my_entry } = state.leaderboard

  return (
    <Card>
      <div className="h2" style={{ marginBottom: 12 }}>실시간 자산 랭킹</div>
      
      {my_entry && (
        <div style={{ background: 'rgba(0,217,255,0.1)', border: '1px solid var(--neon-blue)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
          <div className="space">
            <div>
              <span style={{ fontWeight: 900, color: 'var(--neon-blue)', marginRight: 8 }}>#{my_entry.rank}</span>
              <span style={{ fontWeight: 700 }}>나의 순위</span>
            </div>
            <div style={{ fontWeight: 800 }}>{fmtGold(my_entry.assets)}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {top_entries.map((entry) => {
          const isMe = entry.user_hash === state.userHash
          return (
            <div 
              key={entry.user_hash} 
              className="row small" 
              style={{ 
                padding: '8px 12px', 
                background: isMe ? 'rgba(0,217,255,0.05)' : 'transparent',
                border: isMe ? '1px solid rgba(0,217,255,0.2)' : '1px solid transparent',
                borderRadius: 8
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ 
                  width: 24, 
                  fontWeight: 900, 
                  color: entry.rank <= 3 ? 'var(--gold)' : 'var(--muted)' 
                }}>
                  {entry.rank}
                </span>
                <span style={{ fontWeight: isMe ? 700 : 400 }}>
                  {entry.user_hash.substring(0, 8)}...
                  {isMe && <span className="muted" style={{ marginLeft: 4 }}>(나)</span>}
                </span>
              </div>
              <div style={{ fontWeight: 700 }}>{fmtGold(entry.assets)}</div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
