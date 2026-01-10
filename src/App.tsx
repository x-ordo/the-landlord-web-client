import { GameProvider, useGame } from './context/GameContext'
import {
  TopBar,
  ConsentForm,
  UserAssets,
  RaidTargets,
  RevengePanel,
  ShareModal,
  Inbox,
  ViralPanel,
  BlockList,
  InvitePanel,
  PendingOrders,
  MonetizationPanel,
  EmploymentPanel,
  Leaderboard,
} from './components'
import { BuildingTest } from './BuildingTest'

// Check for test mode via URL parameter
const isTestMode = new URLSearchParams(window.location.search).has('test')

function GameContent() {
  const { state } = useGame()

  // Show consent form if not logged in
  if (!state.snapshot) {
    return <ConsentForm />
  }

  return (
    <>
      {/* Contextual panels */}
      <InvitePanel />
      <RevengePanel />
      <ShareModal />

      {/* Main grid */}
      <div className="grid">
        <UserAssets />
        <Leaderboard />
        <EmploymentPanel />
        <MonetizationPanel />
        <ViralPanel />
        <RaidTargets />
        <Inbox />
        <PendingOrders />
        <BlockList />
      </div>

      {/* Error display */}
      {state.error ? (
        <div className="error" style={{ marginTop: 12 }}>
          {state.error}
        </div>
      ) : null}
    </>
  )
}

export default function App() {
  // Show building test page if ?test is in URL
  if (isTestMode) {
    return <BuildingTest />
  }

  return (
    <GameProvider>
      <div className="container">
        <TopBar />
        <GameContent />
      </div>
    </GameProvider>
  )
}
