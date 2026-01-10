import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react'
import type {
  UserSnapshot,
  RaidTarget,
  RaidResolve,
  InboxData,
  EmploymentData,
  PendingOrdersData,
  BlockListData,
  ShareModalData,
} from '../types'
import * as api from '../api'
import * as toss from '../tossBridge'
import { uuid } from '../util'
import { calculateAssets } from '../constants'
import { getErrorMessage } from '../errors'

// Game state
interface GameState {
  userHash: string
  consented: boolean
  snapshot: UserSnapshot | null
  targets: RaidTarget[]
  inbox: InboxData | null
  employment: EmploymentData | null
  leaderboard: {
    top_entries: Array<{ user_hash: string; building_level: number; assets: number; rank: number }>
    my_entry?: { user_hash: string; building_level: number; assets: number; rank: number }
  } | null
  quests: Array<{
    quest_id: string
    description: string
    current_count: number
    target_count: number
    reward_gold: number
    is_claimed: boolean
    is_completed: boolean
  }> | null
  pending: PendingOrdersData | null
  block: BlockListData | null
  inviteId: string | null
  revengeId: string | null
  revengeInfo: RaidResolve | null
  busy: boolean
  shareModal: ShareModalData | null
  error: string | null
}

// Game actions
interface GameActions {
  setConsented: (value: boolean) => void
  boot: () => Promise<void>
  refreshAll: () => Promise<void>
  collect: () => Promise<void>
  upgrade: () => Promise<void>
  changeBuildingType: (type: string) => Promise<void>
  raid: (defenderHash: string, revengeFor?: string) => Promise<void>
  acceptInvite: () => Promise<void>
  createInvite: () => Promise<void>
  contactsViral: () => Promise<void>
  blockUser: (hash: string) => Promise<void>
  markAllRead: () => Promise<void>
  claimQuest: (questId: string) => Promise<void>
  completePending: (orderId: string) => Promise<void>
  playAd: (rewardType: string) => Promise<void>
  purchase: (sku: string) => Promise<void>
  closeShareModal: () => void
  closeRevenge: () => void
  clearInvite: () => void
}

interface GameContextValue {
  state: GameState
  actions: GameActions
  computed: {
    assets: number
    effectiveGps: number
    revengeAction: { ok: true } | { ok: false; reason: string } | null
  }
}

const GameContext = createContext<GameContextValue | null>(null)

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}

function nowISO() {
  return new Date().toISOString()
}

function qs() {
  return new URLSearchParams(window.location.search)
}

function clearQueryParam(key: string) {
  const u = new URL(window.location.href)
  u.searchParams.delete(key)
  window.history.replaceState({}, '', u.toString())
}

interface GameProviderProps {
  children: ReactNode
}

export function GameProvider({ children }: GameProviderProps) {
  const [userHash, setUserHash] = useState('')
  const [consented, setConsented] = useState(true)
  const [snapshot, setSnapshot] = useState<UserSnapshot | null>(null)
  const [targets, setTargets] = useState<RaidTarget[]>([])
  const [inbox, setInbox] = useState<InboxData | null>(null)
  const [employment, setEmployment] = useState<EmploymentData | null>(null)
  const [leaderboard, setLeaderboard] = useState<{
    top_entries: Array<{ user_hash: string; building_level: number; assets: number; rank: number }>
    my_entry?: { user_hash: string; building_level: number; assets: number; rank: number }
  } | null>(null)
  const [quests, setQuests] = useState<GameState['quests']>(null)
  const [pending, setPending] = useState<PendingOrdersData | null>(null)
  const [block, setBlock] = useState<BlockListData | null>(null)
  const [inviteId, setInviteId] = useState<string | null>(null)
  const [revengeId, setRevengeId] = useState<string | null>(null)
  const [revengeInfo, setRevengeInfo] = useState<RaidResolve | null>(null)
  const [busy, setBusy] = useState(false)
  const [shareModal, setShareModal] = useState<ShareModalData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const moduleId = import.meta.env.VITE_TOSS_MODULE_ID || ''

  // Computed values
  const assets = useMemo(() => {
    if (!snapshot) return 0
    return calculateAssets(snapshot.gold, snapshot.building_level, snapshot.gps)
  }, [snapshot])

  const effectiveGps = snapshot?.gps ?? 0

  const revengeAction = useMemo(() => {
    if (!revengeInfo || !userHash) return null
    if (revengeInfo.defender_hash !== userHash) return { ok: false as const, reason: '피해자(수신자)만 복수 실행 가능' }
    if (revengeInfo.is_revenged) return { ok: false as const, reason: '이미 복수 처리됨' }
    return { ok: true as const }
  }, [revengeInfo, userHash])

  // Actions
  const refreshAll = useCallback(async () => {
    if (!userHash) return
    const [t, ib, emp, pend, bl, lb, q] = await Promise.all([
      api.raidTargets(userHash).catch(() => ({ targets: [] })),
      api.inbox(userHash).catch(() => null),
      api.employmentList(userHash).catch(() => null),
      api.iapPending(userHash).catch(() => null),
      api.blockList(userHash).catch(() => null),
      api.leaderboard(userHash).catch(() => null),
      api.quests(userHash).catch(() => null),
    ])
    setTargets(t.targets || [])
    if (ib) setInbox(ib)
    if (emp) setEmployment(emp)
    if (pend) setPending(pend)
    if (bl) setBlock(bl)
    if (lb) setLeaderboard(lb)
    if (q) setQuests(q.quests)
  }, [userHash])

  const boot = useCallback(async () => {
    setError(null)
    const hash = await toss.getUserHashForGame()
    setUserHash(hash)

    try {
      const snap = await api.sessionStart(hash, consented)
      setSnapshot(snap)
      await api.telemetryEvent(hash, 'session_start', { consented, ts: nowISO() }).catch(() => {})
    } catch (e) {
      setError(getErrorMessage(e))
      return
    }

    const p = qs()
    const inv = p.get('invite')
    const rev = p.get('revenge') || p.get('raid_id')
    if (inv) setInviteId(inv)
    if (rev) setRevengeId(rev)
  }, [consented])

  const collect = useCallback(async () => {
    if (!userHash) return
    setBusy(true)
    setError(null)
    try {
      const r = await api.collect(userHash)
      setSnapshot(r.snapshot)
      await api.telemetryEvent(userHash, 'collect', { amount: r.collected_amount }).catch(() => {})
      await refreshAll()
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setBusy(false)
    }
  }, [userHash, refreshAll])

  const upgrade = useCallback(async () => {
    if (!userHash) return
    setBusy(true)
    setError(null)
    try {
      const r = await api.upgradeBuilding(userHash)
      setSnapshot(r.snapshot)
      await api.telemetryEvent(userHash, 'upgrade_building', { level: r.snapshot.building_level }).catch(() => {})
      await refreshAll()
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setBusy(false)
    }
  }, [userHash, refreshAll])

  const changeBuildingType = useCallback(
    async (type: string) => {
      if (!userHash) return
      setBusy(true)
      setError(null)
      try {
        const r = await api.changeBuildingType(userHash, type)
        setSnapshot(r.snapshot)
        await api.telemetryEvent(userHash, 'change_building_type', { type }).catch(() => {})
        await refreshAll()
      } catch (e) {
        setError(getErrorMessage(e))
      } finally {
        setBusy(false)
      }
    },
    [userHash, refreshAll]
  )

  const raid = useCallback(
    async (defenderHash: string, revengeFor?: string) => {
      if (!userHash) return
      setBusy(true)
      setError(null)
      try {
        const clientNonce = uuid()
        const r = await api.raidExecute(userHash, defenderHash, clientNonce, revengeFor)
        setSnapshot(r.snapshot)

        const og = await api.shareOg(userHash, r.raid_id, userHash, defenderHash).catch(() => null)
        await api
          .telemetryEvent(userHash, 'raid', { defenderHash, loot: r.loot_amount, raid_id: r.raid_id })
          .catch(() => {})

        if (og?.ogImageUrl) {
          setShareModal({
            raidId: Number(r.raid_id),
            ogImageUrl: og.ogImageUrl,
            title: '갓물주 전쟁: 압류 딱지 발부',
            desc: `너 털렸음. 복수하러 와라. (raid=${r.raid_id})`,
          })
        }

        await refreshAll()
      } catch (e) {
        setError(getErrorMessage(e))
      } finally {
        setBusy(false)
      }
    },
    [userHash, refreshAll]
  )

  const playAd = useCallback(
    async (rewardType: string) => {
      if (!userHash) return
      setBusy(true)
      setError(null)
      try {
        await toss.loadRewardedAd('ait-ad-test-rewarded-id')
        const { adEventId } = await toss.showRewardedAd()
        const r = await api.adReward(userHash, rewardType, adEventId)
        setSnapshot(r.snapshot)
        await api.telemetryEvent(userHash, 'ad_reward', { rewardType, adEventId }).catch(() => {})
        await refreshAll()
      } catch (e) {
        setError(getErrorMessage(e))
      } finally {
        setBusy(false)
      }
    },
    [userHash, refreshAll]
  )

  const purchase = useCallback(
    async (sku: string) => {
      if (!userHash) return
      setBusy(true)
      setError(null)
      try {
        // v1.1.3+ handshake
        await toss.createOneTimePurchaseOrderV113(
          sku,
          async ({ orderId }) => {
            try {
              const r = await api.iapGrant(userHash, orderId, sku)
              setSnapshot(r.snapshot)
              await api.telemetryEvent(userHash, 'iap_grant', { orderId, sku }).catch(() => {})
              return true
            } catch {
              return false
            }
          },
          async (ev) => {
            if (ev.type === 'grantResolvedOk' || ev.type === 'mock_success') {
              await api.iapComplete(userHash, ev.orderId).catch(() => {})
              await refreshAll()
            }
          },
          (err) => {
            setError(getErrorMessage(err))
          }
        )
      } catch (e) {
        setError(getErrorMessage(e))
      } finally {
        setBusy(false)
      }
    },
    [userHash, refreshAll]
  )

  const acceptInvite = useCallback(async () => {
    if (!userHash || !inviteId) return
    setBusy(true)
    setError(null)
    try {
      await api.employmentAccept(userHash, inviteId)
      await api.telemetryEvent(userHash, 'employment_accept', { inviteId }).catch(() => {})
      clearQueryParam('invite')
      setInviteId(null)
      await refreshAll()
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setBusy(false)
    }
  }, [userHash, inviteId, refreshAll])

  const createInvite = useCallback(async () => {
    if (!userHash) return
    setBusy(true)
    setError(null)
    try {
      const r = await api.employmentInvite(userHash)
      await api.telemetryEvent(userHash, 'employment_invite_create', {}).catch(() => {})
      const url = r.invite_url || `${window.location.origin}?invite=${encodeURIComponent(r.invite_id)}`
      toss.shareLink({
        title: '갓물주 전쟁: 알바 채용',
        description: '들어와서 수락하면 내 건물 수익이 오른다.',
        url,
        ogImageUrl: '',
      })
      await refreshAll()
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setBusy(false)
    }
  }, [userHash, refreshAll])

  const contactsViral = useCallback(async () => {
    if (!userHash) return
    setBusy(true)
    setError(null)
    try {
      const r = await api.viralContactsSend(userHash)
      setSnapshot(r.snapshot)
      await api.telemetryEvent(userHash, 'viral_contacts_send', { moduleId }).catch(() => {})
      if (moduleId) {
        toss.contactsViral(moduleId)
      } else {
        alert('VITE_TOSS_MODULE_ID 미설정. Toss 환경에서 moduleId 필요.')
      }
      await refreshAll()
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setBusy(false)
    }
  }, [userHash, moduleId, refreshAll])

  const blockUser = useCallback(
    async (hash: string) => {
      if (!userHash) return
      setBusy(true)
      setError(null)
      try {
        await api.blockAdd(userHash, hash, 'inbox_block')
        await api.telemetryEvent(userHash, 'block_add', { blocked: hash }).catch(() => {})
        await refreshAll()
      } catch (e) {
        setError(getErrorMessage(e))
      } finally {
        setBusy(false)
      }
    },
    [userHash, refreshAll]
  )

  const markAllRead = useCallback(async () => {
    if (!userHash || !inbox) return
    setBusy(true)
    setError(null)
    try {
      const unreadIds = inbox.items.filter((x) => !x.read_at).map((x) => x.id)
      if (unreadIds.length) await api.inboxRead(userHash, unreadIds)
      await api.telemetryEvent(userHash, 'inbox_mark_all_read', { count: unreadIds.length }).catch(() => {})
      await refreshAll()
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setBusy(false)
    }
  }, [userHash, inbox, refreshAll])

  const claimQuest = useCallback(
    async (questId: string) => {
      if (!userHash) return
      setBusy(true)
      setError(null)
      try {
        const r = await api.questClaim(userHash, questId)
        setSnapshot(r.snapshot)
        await api.telemetryEvent(userHash, 'quest_claim', { questId, reward: r.reward_gold }).catch(() => {})
        await refreshAll()
      } catch (e) {
        setError(getErrorMessage(e))
      } finally {
        setBusy(false)
      }
    },
    [userHash, refreshAll]
  )

  const completePending = useCallback(
    async (orderId: string) => {
      if (!userHash) return
      setBusy(true)
      setError(null)
      try {
        await api.iapComplete(userHash, orderId)
        await api.telemetryEvent(userHash, 'iap_complete', { orderId }).catch(() => {})
        await refreshAll()
      } catch (e) {
        setError(getErrorMessage(e))
      } finally {
        setBusy(false)
      }
    },
    [userHash, refreshAll]
  )

  const closeShareModal = useCallback(() => setShareModal(null), [])

  const closeRevenge = useCallback(() => {
    clearQueryParam('revenge')
    clearQueryParam('raid_id')
    setRevengeId(null)
    setRevengeInfo(null)
  }, [])

  const clearInvite = useCallback(() => {
    clearQueryParam('invite')
    setInviteId(null)
  }, [])

  // Effects
  useEffect(() => {
    boot()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!userHash) return
    refreshAll()
  }, [userHash, refreshAll])

  useEffect(() => {
    if (!userHash || !revengeId) return
    api
      .raidResolve(userHash, revengeId)
      .then((r) => setRevengeInfo(r))
      .catch(() => setRevengeInfo(null))
  }, [userHash, revengeId])

  useEffect(() => {
    if (!userHash || !snapshot) return
    const score = Math.floor(assets)
    toss.submitLeaderboard(score)
    api.telemetryEvent(userHash, 'leaderboard_submit', { score }).catch(() => {})
  }, [userHash, snapshot?.gold, snapshot?.building_level, snapshot?.gps, assets])

  const state: GameState = {
    userHash,
    consented,
    snapshot,
    targets,
    inbox,
    employment,
    leaderboard,
    quests,
    pending,
    block,
    inviteId,
    revengeId,
    revengeInfo,
    busy,
    shareModal,
    error,
  }

  const actions: GameActions = {
    setConsented,
    boot,
    refreshAll,
    collect,
    upgrade,
    changeBuildingType,
    raid,
    acceptInvite,
    createInvite,
    contactsViral,
    blockUser,
    markAllRead,
    claimQuest,
    completePending,
    playAd,
    purchase,
    closeShareModal,
    closeRevenge,
    clearInvite,
  }

  const computed = {
    assets,
    effectiveGps,
    revengeAction,
  }

  return <GameContext.Provider value={{ state, actions, computed }}>{children}</GameContext.Provider>
}
