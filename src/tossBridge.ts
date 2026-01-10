/**
 * Toss bridge wrapper.
 * - Works in normal browser without Toss packages installed.
 * - If you HAVE access to Toss packages, replace this with direct imports.
 *
 * The Vite dynamic import uses @vite-ignore to avoid build-time resolution.
 */
import { uuid } from './util'

const TOSS_WEB_PKG = '@apps-in-toss/web-framework'

type ShareLinkInput = { url: string; ogImageUrl?: string; title?: string; description?: string }

interface TossModule {
  getUserKeyForGame?: (opts: { gameId: string }) => Promise<string>
  generateHapticFeedback?: (opts: { type: string }) => Promise<void>
  loadFullScreenAd?: (opts?: { adUnitId?: string }) => Promise<unknown>
  showFullScreenAd?: (loaded?: unknown) => Promise<{ adEventId?: string; eventId?: string }>
  getTossShareLink?: (input: ShareLinkInput) => Promise<{ shareLink: string }>
  share?: (opts: { url: string }) => Promise<void>
  contactsViral?: (opts: { moduleId: string }) => Promise<void>
  IAP?: {
    getProductItemList?: () => Promise<{ items: Array<{ sku: string; name: string }> }>
    createOneTimePurchaseOrder?: (opts: {
      options: {
        sku: string
        processProductGrant: (params: { orderId: string }) => Promise<boolean>
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onEvent?: (ev: any) => void
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError?: (err: any) => void
    }) => () => void
    getPendingOrders?: () => Promise<{ orders: Array<{ orderId: string; productId: string }> }>
    completeProductGrant?: (opts: { orderId: string }) => Promise<void>
  }
  createOneTimePurchaseOrder?: (opts: { productId: string }) => Promise<{ orderId: string; id: string }>
}

async function tryImportToss(): Promise<TossModule | null> {
  try {
    const mod = await import(/* @vite-ignore */ TOSS_WEB_PKG)
    return mod as TossModule
  } catch {
    // Fallback: check window for global bridge injected by Toss
    // @ts-ignore
    return window.AppsInToss || null
  }
}

export async function getUserHashForGame(): Promise<string> {
  const mod = await tryImportToss()
  if (mod && typeof mod.getUserKeyForGame === 'function') {
    const r = await mod.getUserKeyForGame({ gameId: import.meta.env.VITE_TOSS_GAME_ID || 'the-landlord' })
    // @ts-ignore
    const hash = r?.userKey || r?.hash || r
    if (typeof hash === 'string' && hash.length > 0) return hash
  }
  // Browser fallback
  const key = localStorage.getItem('dev_user_hash') || `dev_${uuid()}`
  localStorage.setItem('dev_user_hash', key)
  return key
}

export async function haptic(type: 'LIGHT' | 'MEDIUM' | 'HEAVY' = 'LIGHT') {
  const mod = await tryImportToss()
  if (mod && typeof mod.generateHapticFeedback === 'function') {
    return await mod.generateHapticFeedback({ type })
  }
  // no-op in browser
}

// Rewarded Ads
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let loadedAd: any = null
export async function loadRewardedAd(adUnitId: string) {
  const mod = await tryImportToss()
  if (mod && typeof mod.loadFullScreenAd === 'function') {
    loadedAd = await mod.loadFullScreenAd({ adUnitId })
    return true
  }
  return true // mock ok
}

export async function showRewardedAd(): Promise<{ adEventId: string }> {
  const mod = await tryImportToss()
  if (mod && typeof mod.showFullScreenAd === 'function') {
    const res = await mod.showFullScreenAd(loadedAd)
    loadedAd = null
    return { adEventId: res?.adEventId || res?.eventId || `toss_ad_${uuid()}` }
  }
  // Browser mock
  alert('광고 시청(모의) 완료')
  return { adEventId: `mock_ad_${uuid()}` }
}

// Legacy for backward compatibility
export async function showFullScreenAd(): Promise<{ adEventId: string }> {
  await loadRewardedAd('')
  return showRewardedAd()
}

// IAP
export async function getProductItemList() {
  const mod = await tryImportToss()
  if (mod?.IAP?.getProductItemList) {
    return await mod.IAP.getProductItemList()
  }
  return { items: [{ sku: 'shield_24h', name: '24시간 보호' }, { sku: 'auto_collect_7d', name: '7일 자동수거' }] }
}

export async function createOneTimePurchaseOrderV113(
  sku: string,
  onGrantRequest: (params: { orderId: string }) => Promise<boolean>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEvent?: (ev: any) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (err: any) => void
) {
  const mod = await tryImportToss()
  if (mod?.IAP?.createOneTimePurchaseOrder) {
    return mod.IAP.createOneTimePurchaseOrder({
      options: { sku, processProductGrant: onGrantRequest },
      onEvent,
      onError
    })
  }
  // Mock fallback
  const orderId = `mock_order_${sku}_${Date.now()}`
  window.setTimeout(async () => {
    const ok = await onGrantRequest({ orderId })
    if (ok) onEvent?.({ type: 'mock_success', orderId })
    else onError?.(new Error('Mock grant failed'))
  }, 1000)
  return () => {}
}

export async function createOneTimePurchaseOrderLegacy(productId: string) {
  const mod = await tryImportToss()
  if (typeof mod?.createOneTimePurchaseOrder === 'function') {
    const res = await mod.createOneTimePurchaseOrder({ productId })
    return res.orderId || res.id
  }
  return `mock_order_${productId}_${Date.now()}`
}

export async function getPendingOrders() {
  const mod = await tryImportToss()
  if (mod?.IAP?.getPendingOrders) {
    return await mod.IAP.getPendingOrders()
  }
  return { orders: [] }
}

export async function completeProductGrant(orderId: string) {
  const mod = await tryImportToss()
  if (mod?.IAP?.completeProductGrant) {
    await mod.IAP.completeProductGrant({ orderId })
  }
}

export async function getTossShareLink(input: ShareLinkInput) {
  const mod = await tryImportToss()
  if (mod && typeof mod.getTossShareLink === 'function') {
    const res = await mod.getTossShareLink(input)
    return res.shareLink
  }
  return input.url
}

export async function share(url: string) {
  const mod = await tryImportToss()
  if (mod && typeof mod.share === 'function') {
    return await mod.share({ url })
  }
  // Browser fallback
  try {
    await navigator.share({ url })
  } catch {
    prompt('공유 링크', url)
  }
}

export async function shareLink(input: ShareLinkInput) {
  const link = await getTossShareLink(input)
  await share(link)
}

export async function contactsViral(moduleId: string) {
  const mod = await tryImportToss()
  if (mod && typeof mod.contactsViral === 'function') {
    return await mod.contactsViral({ moduleId })
  }
  alert('연락처 바이럴(모의) — Toss 환경에서만 동작')
}

export async function openLeaderboard() {
  try {
    // @ts-ignore - Toss GameCenter API
    if (window.AppsInToss?.GameCenter?.openGameCenterLeaderboard) {
      // @ts-ignore - Toss GameCenter API
      return await window.AppsInToss.GameCenter.openGameCenterLeaderboard()
    }
  } catch {
    // Silently fail if not in Toss environment
  }
}

export async function submitLeaderboard(score: number) {
  try {
    // @ts-ignore - Toss GameCenter API
    if (window.AppsInToss?.GameCenter?.submitGameCenterLeaderBoardScore) {
      // @ts-ignore - Toss GameCenter API
      return await window.AppsInToss.GameCenter.submitGameCenterLeaderBoardScore({ score })
    }
  } catch {
    // Silently fail if not in Toss environment
  }
}
