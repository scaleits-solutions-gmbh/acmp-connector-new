import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindClientCommandCountOut {
  public static schema = z.object({
    count: z.number(),
  });

  private constructor(private readonly _data: z.infer<typeof FindClientCommandCountOut.schema>) {}

  public static create(data: z.infer<typeof FindClientCommandCountOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindClientCommandCountOut.schema,
      failLogMessage: 'FindClientCommandCountOut create factory validation failed',
      factory: (validData) => new FindClientCommandCountOut(validData),
    });
  }

  public get count() {
    return this._data.count;
  }
}
