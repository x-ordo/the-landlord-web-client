export type UserSnapshot = {
  user_hash: string
  gold: number
  building_level: number
  building_type: string
  gps: number
  last_collect_at: string
  shield_until?: string | null
  auto_collect_until?: string | null
}

export type RaidTarget = {
  defender_hash: string
  defender_assets: number
  max_loot_hint: number
}

export type InboxItem = {
  id: string
  type: string
  payload: Record<string, unknown>
  created_at: string
  read_at?: string | null
}

export type RaidResolve = {
  raid_id: string
  attacker_hash: string
  defender_hash: string
  loot_amount: number
  is_revenged: boolean
  created_at: string
}

// Additional types for component props
export type InboxData = {
  unread_count: number
  items: InboxItem[]
}

export type EmploymentData = {
  active_count: number
  bonus_multiplier: number
  employees: Array<{
    employer_hash: string
    employee_hash: string
    status: string
    created_at: string
  }>
}

export type PendingOrdersData = {
  orders: Array<{
    orderId: string
    productId: string
    granted_at: string
  }>
}

export type BlockListData = {
  items: Array<{
    blocked_hash: string
    reason: string
    created_at: string
  }>
}

export type ShareModalData = {
  raidId: number
  ogImageUrl: string
  title: string
  desc: string
}
