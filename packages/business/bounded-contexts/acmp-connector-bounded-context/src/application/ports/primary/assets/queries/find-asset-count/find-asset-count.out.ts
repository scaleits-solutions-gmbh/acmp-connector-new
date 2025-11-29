import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';


export class FindAssetCountOut {
  public static schema = z.object({
    count: z.number(),
  });

  private constructor(private readonly _data: z.infer<typeof FindAssetCountOut.schema>) {}

  public static create(data: z.infer<typeof FindAssetCountOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindAssetCountOut.schema,
      failLogMessage: 'FindAssetCountOut create factory validation failed',
      factory: (validData) => new FindAssetCountOut(validData),
    });
  }

  public get count() {
    return this._data.count;
  }
}
