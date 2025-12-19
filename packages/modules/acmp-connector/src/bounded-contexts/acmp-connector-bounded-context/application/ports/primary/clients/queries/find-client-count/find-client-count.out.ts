import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindClientCountOut {
  public static schema = z.object({
    count: z.number(),
  });

  private constructor(private readonly _data: z.infer<typeof FindClientCountOut.schema>) {}

  public static create(data: z.infer<typeof FindClientCountOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindClientCountOut.schema,
      failLogMessage: 'FindClientCountOut create factory validation failed',
      factory: (validData) => new FindClientCountOut(validData),
    });
  }

  public get count() {
    return this._data.count;
  }
}
