import type { XenoWebTransport } from '@/domain'

import { BaseHttpAdapter } from './base.http-adapter'

/**
 * @description Native HTTP adapter.
 * @author Xeno
 * @version 1.2.1
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export class NativeHttpAdapter extends BaseHttpAdapter {
  public adapt(req: Request, res: Response): XenoWebTransport {
    return {
      request: {
        ...req,
        path: new URL(req.url).pathname,
      },
      response: res,
    }
  }
}
