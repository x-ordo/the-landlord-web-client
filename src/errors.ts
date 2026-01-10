/**
 * Custom error classes for better error handling
 */

/**
 * API error with code and status
 */
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'ApiError'
  }

  /**
   * Check if error is due to insufficient funds
   */
  isInsufficientFunds(): boolean {
    return this.code === 'insufficient_funds'
  }

  /**
   * Check if error is rate limited
   */
  isRateLimited(): boolean {
    return this.status === 429
  }

  /**
   * Check if error is a cooldown error
   */
  isCooldown(): boolean {
    return this.code.includes('cooldown')
  }

  /**
   * Check if error is blocked by policy
   */
  isBlocked(): boolean {
    return this.code === 'blocked_by_policy'
  }
}

/**
 * Network error (connection failed, timeout, etc.)
 */
export class NetworkError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message)
    this.name = 'NetworkError'
  }
}

/**
 * Parse error response and create appropriate error
 */
export function parseApiError(status: number, body?: { code?: string; message?: string }): ApiError {
  const code = body?.code || `http_${status}`
  const message = body?.message || getDefaultMessage(status)
  return new ApiError(code, message, status)
}

/**
 * Get default error message for HTTP status
 */
function getDefaultMessage(status: number): string {
  switch (status) {
    case 400:
      return '잘못된 요청입니다'
    case 401:
      return '인증이 필요합니다'
    case 403:
      return '접근이 거부되었습니다'
    case 404:
      return '리소스를 찾을 수 없습니다'
    case 429:
      return '요청이 너무 많습니다. 잠시 후 다시 시도하세요'
    case 500:
      return '서버 오류가 발생했습니다'
    default:
      return `요청 실패 (${status})`
  }
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }
  if (error instanceof NetworkError) {
    return '네트워크 연결을 확인해주세요'
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
