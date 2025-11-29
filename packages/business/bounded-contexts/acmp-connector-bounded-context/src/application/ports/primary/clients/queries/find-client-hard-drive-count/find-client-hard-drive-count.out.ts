import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';


export class FindClientHardDriveCountOut {
  public static schema = z.object({
    count: z.number(),
  });

  private constructor(private readonly _data: z.infer<typeof FindClientHardDriveCountOut.schema>) {}

  public static create(data: z.infer<typeof FindClientHardDriveCountOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindClientHardDriveCountOut.schema,
      failLogMessage: 'FindClientHardDriveCountOut create factory validation failed',
      factory: (validData) => new FindClientHardDriveCountOut(validData),
    });
  }

  public get count() {
    return this._data.count;
  }
}
