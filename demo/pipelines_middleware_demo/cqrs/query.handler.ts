import { IHandler, IQuery,Result } from "@/domain"
import { GetStatusQuery } from "./query"

export class GetStatusQueryHandler implements IHandler<IQuery<{ status: string; uptime: number }>, { status: string; uptime: number }> {
    public async handle(request: GetStatusQuery, _signal?: AbortSignal): Promise<Result<{ status: string; uptime: number }>> {
        console.log(`[CQRS: Query] 🔵 Received GetStatusQuery. Verbose mode: ${request.verbose}`)

        return Result.ok({
            status: 'All systems operational',
            uptime: process.uptime()
        })
    }
}