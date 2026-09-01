import { IHttpClient, type IServiceResilience, RemoteDataSource, type ResultType } from '@xeno/core'

export class CustomDataSource extends RemoteDataSource {
    constructor(httpClient: IHttpClient, resilienceClient: IServiceResilience) {
        super(httpClient, resilienceClient)
    }

    public async getPokemonByName(name: string, signal?: AbortSignal): Promise<ResultType<any>> {
        const endpoint = `pokemon/${name}`

        return await this.get(endpoint, { signal })
    }
}