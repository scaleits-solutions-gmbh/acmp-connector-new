import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';


export class FindJobCountOut {
  public static schema = z.object({
    count: z.number(),
  });

  private constructor(private readonly _data: z.infer<typeof FindJobCountOut.schema>) {}

  public static create(data: z.infer<typeof FindJobCountOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindJobCountOut.schema,
      failLogMessage: 'FindJobCountOut create factory validation failed',
      factory: (validData) => new FindJobCountOut(validData),
    });
  }

  public get count() {
    return this._data.count;
  }
}
