import { useGame } from '../../context/GameContext'
import { Card, Button } from '../common'

export function PendingOrders() {
  const { state, actions } = useGame()

  return (
    <Card>
      <div className="h2">IAP Pending (Dev)</div>
      <div className="muted small">실전: getPendingOrders → grant → completeProductGrant</div>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {state.pending?.orders?.map((o) => (
          <div key={o.orderId} className="row">
            <div>
              <div style={{ fontWeight: 700 }}>{o.productId}</div>
              <div className="muted small">{o.orderId}</div>
            </div>
            <Button onClick={() => actions.completePending(o.orderId)} disabled={state.busy}>
              complete
            </Button>
          </div>
        ))}
        {!state.pending?.orders?.length ? <div className="muted small">pending 없음</div> : null}
      </div>
    </Card>
  )
}
