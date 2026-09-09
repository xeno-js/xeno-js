import { Guards, type IAllowOrigin, type Optional } from '@xeno-js/shared'

export class AllowOrigin implements IAllowOrigin {
  constructor(private readonly _list: string[]) {}

  public isAllowed(origin: Optional<string>): boolean {
    if (Guards.isNullOrEmpty(origin)) return false

    return this._list.includes(origin.trim().toLowerCase())
  }
}
