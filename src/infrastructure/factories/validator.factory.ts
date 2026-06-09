import type { ZodType } from 'zod'

import type { IFactory, IValidatorService } from '@/domain'
import { ZodValidatorService } from '@/infrastructure'

/**
 * @description Factory class responsible for creating instances of ZodValidatorService. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the ZodValidatorService, promoting separation of concerns and flexibility in managing validator instances across the application.
 */
export class ZodValidatorFactory<T> implements IFactory<void, IValidatorService> {
  public create(): IValidatorService {
    return new ZodValidatorService(new Map<string, ZodType<T>>())
  }
}
