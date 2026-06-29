import { TokenHelper } from '@graviton5/core'
import type { BaseController } from '@graviton5/core'

// ─────────────────────────────────────────────────────────────────────────────
// INJECTION TOKENS
// ─────────────────────────────────────────────────────────────────────────────
// This file defines injection tokens for the User DataSource and the Filter Builder. These tokens are used for dependency injection, allowing for the registration and resolution of services in a decoupled manner. The tokens are created using the TokenHelper utility, which ensures type safety and uniqueness of the tokens within the application context.
export const PING_CONTROLLER_TOKEN = TokenHelper.createToken<BaseController<{ message: string; }, { echoed: string }>>('PING_CONTROLLER_TOKEN')
export const STATUS_CONTROLLER_TOKEN = TokenHelper.createToken<BaseController<{ verbose: boolean; }, { status: string; uptime: number }>>('STATUS_CONTROLLER_TOKEN')