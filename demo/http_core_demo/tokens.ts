import { IHttpClient, IRemoteDataSource, TokenHelper } from '@xeno/core'

// ─────────────────────────────────────────────────────────────────────────────
// INJECTION TOKENS
// ─────────────────────────────────────────────────────────────────────────────
// 
export const DATA_SOURCE_TOKEN = TokenHelper.createToken<IRemoteDataSource>('DATA_SOURCE_TOKEN')
export const HTTP_CLIENT_TOKEN = TokenHelper.createToken<IHttpClient>('HTTP_CLIENT_TOKEN')