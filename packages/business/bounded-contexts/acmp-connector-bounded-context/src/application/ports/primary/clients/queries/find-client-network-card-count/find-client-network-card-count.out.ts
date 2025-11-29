import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';


export class FindClientNetworkCardCountOut {
  public static schema = z.object({
    count: z.number(),
  });

  private constructor(private readonly _data: z.infer<typeof FindClientNetworkCardCountOut.schema>) {}

  public static create(data: z.infer<typeof FindClientNetworkCardCountOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindClientNetworkCardCountOut.schema,
      failLogMessage: 'FindClientNetworkCardCountOut create factory validation failed',
      factory: (validData) => new FindClientNetworkCardCountOut(validData),
    });
  }

  public get count() {
    return this._data.count;
  }
}
