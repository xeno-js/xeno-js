import { IHttpClient, RemoteDataSource, TokenHelper } from '@xeno/core'

// ─────────────────────────────────────────────────────────────────────────────
// INJECTION TOKENS
// ─────────────────────────────────────────────────────────────────────────────
// 
export const DATA_SOURCE_TOKEN = TokenHelper.createToken<RemoteDataSource>('DATSOURCE_TOKEN')
export const HTTP_CLIENT_TOKEN = TokenHelper.createToken<IHttpClient>('HTTP_CLIENT_TOKEN')