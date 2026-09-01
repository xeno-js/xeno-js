import { IHttpClient, IRemoteDataSource, XenoRegistry } from '@xeno/core'

// ─────────────────────────────────────────────────────────────────────────────
// INJECTION TOKENS
// ─────────────────────────────────────────────────────────────────────────────
// 
export interface AppRegistry extends XenoRegistry {
    CUSTOM_DATA_SOURCE_TOKEN: IRemoteDataSource
    MY_HTTP_CLIENT_TOKEN: IHttpClient
}
