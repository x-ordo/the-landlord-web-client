import type { RaidTarget, UserSnapshot } from './types'
import { ApiError, NetworkError, parseApiError } from './errors'

const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '') || 'http://localhost:8080'
const CLIENT_VERSION = import.meta.env.VITE_CLIENT_VERSION || 'web-dev'

type ReqInit = RequestInit & { idempotencyKey?: string }

async function req<T>(path: string, userHash: string, init: ReqInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-User-Hash': userHash,
    'X-Client-Version': CLIENT_VERSION,
    ...(init.headers as Record<string, string> | undefined),
  }
  if (init.idempotencyKey) headers['Idempotency-Key'] = init.idempotencyKey

  let res: Response
  try {
    res = await fetch(BASE + path, { ...init, headers })
  } catch (err) {
    throw new NetworkError('네트워크 연결 실패', err)
  }

  if (!res.ok) {
    let body: { code?: string; message?: string } | undefined
    try {
      body = await res.json()
    } catch {
      // ignore JSON parse errors
    }
    throw parseApiError(res.status, body)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

// Re-export error classes for convenience
export { ApiError, NetworkError }

export async function sessionStart(userHash: string, consented: boolean): Promise<UserSnapshot> {
  return req('/session/start', userHash, {
    method: 'POST',
    body: JSON.stringify({ consented, client_version: CLIENT_VERSION }),
  })
}

export async function snapshot(userHash: string): Promise<UserSnapshot> {
  return req('/snapshot', userHash, { method: 'GET' })
}

export async function collect(userHash: string): Promise<{ collected_amount: number; snapshot: UserSnapshot }> {
  return req('/collect', userHash, {
    method: 'POST',
    idempotencyKey: `collect:${userHash}:${new Date().toISOString().slice(0, 13)}`,
  })
}

export async function upgradeBuilding(userHash: string): Promise<{ spent: number; snapshot: UserSnapshot }> {
  return req('/upgrade/building', userHash, {
    method: 'POST',
    idempotencyKey: `upgrade:${userHash}:${new Date().toISOString().slice(0, 13)}`,
    body: JSON.stringify({ target: 'building' }),
  })
}

export async function changeBuildingType(userHash: string, type: string): Promise<{ snapshot: UserSnapshot }> {
  return req('/upgrade/building', userHash, {
    method: 'POST',
    idempotencyKey: `change_type:${userHash}:${type}`,
    body: JSON.stringify({ target: 'type', type }),
  })
}

export async function raidTargets(userHash: string): Promise<{ targets: RaidTarget[] }> {
  return req('/raid/targets', userHash, { method: 'GET' })
}

export async function raidExecute(
  userHash: string,
  defenderHash: string,
  clientNonce: string,
  revengeForRaidId?: string
) {
  return req<{ raid_id: string; loot_amount: number; snapshot: UserSnapshot }>('/raid/execute', userHash, {
    method: 'POST',
    idempotencyKey: `raid:${userHash}:${defenderHash}:${clientNonce}`,
    body: JSON.stringify({
      defender_hash: defenderHash,
      client_raid_nonce: clientNonce,
      revenge_for_raid_id: revengeForRaidId || undefined,
    }),
  })
}

export async function raidResolve(
  userHash: string,
  raidId: string
): Promise<{
  raid_id: string
  attacker_hash: string
  defender_hash: string
  loot_amount: number
  is_revenged: boolean
  created_at: string
}> {
  return req('/raid/resolve?raid_id=' + encodeURIComponent(raidId), userHash, { method: 'GET' })
}

export async function inbox(
  userHash: string
): Promise<{
  unread_count: number
  items: Array<{
    id: string
    type: string
    payload: Record<string, unknown>
    created_at: string
    read_at?: string | null
  }>
}> {
  return req('/inbox', userHash, { method: 'GET' })
}

export async function inboxRead(userHash: string, ids: string[]) {
  return req<void>('/inbox/read', userHash, { method: 'POST', body: JSON.stringify({ ids }) })
}

export async function employmentInvite(userHash: string) {
  return req<{ invite_id: string; invite_url: string }>('/employment/invite', userHash, {
    method: 'POST',
    idempotencyKey: `emp_invite:${userHash}:${new Date().toISOString().slice(0, 10)}`,
  })
}

export async function employmentAccept(userHash: string, inviteId: string) {
  return req<{ activated: boolean; snapshot: UserSnapshot }>('/employment/accept', userHash, {
    method: 'POST',
    idempotencyKey: `emp_accept:${userHash}:${inviteId}`,
    body: JSON.stringify({ invite_id: inviteId }),
  })
}

export async function employmentList(userHash: string) {
  return req<{
    active_count: number
    bonus_multiplier: number
    employees: Array<{ employer_hash: string; employee_hash: string; status: string; created_at: string }>
  }>('/employment/list', userHash, { method: 'GET' })
}

export async function shareOg(userHash: string, raidId: string, attackerHash: string, defenderHash: string) {
  return req<{ ogImageUrl: string }>('/share/og', userHash, {
    method: 'POST',
    body: JSON.stringify({ raid_id: raidId, attacker_hash: attackerHash, defender_hash: defenderHash }),
  })
}

export async function viralContactsSend(userHash: string) {
  return req<{ granted: boolean; snapshot: UserSnapshot; reward_gold: number; retry_at?: string }>(
    '/viral/contacts/send',
    userHash,
    {
      method: 'POST',
      idempotencyKey: `viral_contacts:${userHash}:${new Date().toISOString().slice(0, 10)}`,
      body: JSON.stringify({ source: 'contactsViral' }),
    }
  )
}

export async function blockList(userHash: string) {
  return req<{ items: Array<{ blocked_hash: string; reason: string; created_at: string }> }>('/block', userHash, {
    method: 'GET',
  })
}

export async function blockAdd(userHash: string, blockedHash: string, reason = 'manual') {
  return req<void>('/block', userHash, {
    method: 'POST',
    idempotencyKey: `block:${userHash}:${blockedHash}`,
    body: JSON.stringify({ blocked_hash: blockedHash, reason }),
  })
}

export async function telemetryEvent(userHash: string, eventName: string, props: Record<string, unknown> = {}) {
  return req<void>('/telemetry/event', userHash, {
    method: 'POST',
    body: JSON.stringify({ event_name: eventName, props }),
  })
}

export async function iapPending(userHash: string) {
  return req<{ orders: Array<{ orderId: string; productId: string; granted_at: string }> }>('/iap/pending', userHash, {
    method: 'GET',
  })
}

export async function iapGrant(userHash: string, orderId: string, productId: string) {
  return req<{ granted: boolean; snapshot: UserSnapshot }>('/iap/grant', userHash, {
    method: 'POST',
    idempotencyKey: `iap_grant:${userHash}:${orderId}`,
    body: JSON.stringify({ orderId, productId }),
  })
}

export async function iapComplete(userHash: string, orderId: string) {
  return req<{ completed: boolean }>('/iap/complete', userHash, {
    method: 'POST',
    idempotencyKey: `iap_complete:${userHash}:${orderId}`,
    body: JSON.stringify({ orderId }),
  })
}

export async function adReward(userHash: string, rewardType: string, adEventId: string) {
  return req<{ snapshot: UserSnapshot }>('/ad/reward', userHash, {
    method: 'POST',
    idempotencyKey: `ad_reward:${userHash}:${adEventId}`,
    body: JSON.stringify({ reward_type: rewardType, ad_event_id: adEventId }),
  })
}

export async function shareReward(userHash: string, raidId: number) {
  return req<{ granted: boolean; reward_gold: number; snapshot: UserSnapshot }>('/share/reward', userHash, {
    method: 'POST',
    idempotencyKey: `share_reward:${userHash}:${raidId}`,
    body: JSON.stringify({ raid_id: raidId }),
  })
}

export async function leaderboard(userHash: string) {
  return req<{
    top_entries: Array<{ user_hash: string; building_level: number; assets: number; rank: number }>
    my_entry?: { user_hash: string; building_level: number; assets: number; rank: number }
  }>('/leaderboard', userHash, { method: 'GET' })
}

export async function quests(userHash: string) {
  return req<{
    quests: Array<{
      quest_id: string
      description: string
      current_count: number
      target_count: number
      reward_gold: number
      is_claimed: boolean
      is_completed: boolean
    }>
  }>('/quests', userHash, { method: 'GET' })
}

export async function questClaim(userHash: string, questId: string) {
  return req<{ success: boolean; reward_gold: number; snapshot: UserSnapshot }>('/quests/claim', userHash, {
    method: 'POST',
    body: JSON.stringify({ quest_id: questId }),
  })
}
