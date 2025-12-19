import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindClientInstalledSoftwareCountOut {
  public static schema = z.object({
    count: z.number(),
  });

  private constructor(private readonly _data: z.infer<typeof FindClientInstalledSoftwareCountOut.schema>) {}

  public static create(data: z.infer<typeof FindClientInstalledSoftwareCountOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindClientInstalledSoftwareCountOut.schema,
      failLogMessage: 'FindClientInstalledSoftwareCountOut create factory validation failed',
      factory: (validData) => new FindClientInstalledSoftwareCountOut(validData),
    });
  }

  public get count() {
    return this._data.count;
  }
}
