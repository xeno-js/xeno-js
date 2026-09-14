import type { Dictionary, HttpMethod, IFactory } from '@xeno-js/shared'

import type { IAllowMethod } from '@/domain'

import { AllowMethodRegistry } from '../services/allow_methods'

/**
 * @description Factory class responsible for creating instances of ZodValidatorService based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the ZodValidatorService, including the initialization of the underlying ZodValidatorService instance with the specified configuration options such as URL and API key. This design promotes separation of concerns and allows for flexibility in managing ZodValidatorService instances across the application.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class AllowMethodFactory implements IFactory<Dictionary<HttpMethod[]>, IAllowMethod> {
  public create(opts: Dictionary<HttpMethod[]>): IAllowMethod {
    const allowMethodService = new AllowMethodRegistry()

    // 2. Iteriamo sugli schemi passati nella configurazione e li registriamo (Ora in modo sincrono!)
    for (const [intentKey, schema] of Object.entries(opts)) {
      allowMethodService.add(intentKey, schema)
    }

    return allowMethodService
  }
}
