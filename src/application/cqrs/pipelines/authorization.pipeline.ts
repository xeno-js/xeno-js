import type { Delegate, IPipelineBehavior, IRequest, IStrategy, ResultType } from '@/domain'
import { Result } from '@/domain'

/**
 * @description Middleware che gestisce l'autenticazione e l'autorizzazione dei comandi.
 * Intercetta i comandi che implementano ISecureCommand e verifica se l'utente è autenticato e ha i ruoli necessari.
 * Se il comando non richiede autorizzazione, delega semplicemente al prossimo middleware.
 *
 * @author XenoJS
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/XenoJS
 */
export class AuthorizationPipeline<TInput extends IRequest, TResult> implements IPipelineBehavior<
  TInput,
  TResult
> {
  /**
   * @description Costruisce una nuova istanza di AuthorizationPipeline, accettando un array di strategie di autorizzazione. Ogni strategia rappresenta una regola o un criterio specifico per determinare se un comando è autorizzato o meno. Durante l'esecuzione del pipeline, ogni strategia viene valutata in ordine, e se una qualsiasi strategia determina che il comando non è autorizzato, il pipeline restituisce un risultato di fallimento con l'errore corrispondente. Se tutte le strategie passano, il pipeline delega al prossimo comportamento nella catena.
   * @param _strategies Un array di oggetti che implementano l'interfaccia IStrategy, utilizzati per valutare l'autorizzazione dei comandi.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  constructor(private readonly _strategies: IStrategy<TInput>[]) {}

  public async handle(request: TInput, next: Delegate<TResult>): Promise<ResultType<TResult>> {
    for (const strategy of this._strategies) {
      const result = await strategy.execute(request)
      if (!result.isOk()) {
        return Result.fail(result.getErrorOrThrow())
      }
    }

    return next()
  }
}
