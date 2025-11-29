import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindClientHardDriveCountIn {
  public static schema = z.object({
    clientId: z.string(),
  });

  private constructor(private readonly _data: z.infer<typeof FindClientHardDriveCountIn.schema>) {}

  public static create(data: z.infer<typeof FindClientHardDriveCountIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindClientHardDriveCountIn.schema,
      failLogMessage: 'FindClientHardDriveCountIn create factory validation failed',
      factory: (validData) => new FindClientHardDriveCountIn(validData),
    });
  }

  public get clientId() {
    return this._data.clientId;
  }
}
