import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindClientInstalledSoftwareCountIn {
  public static schema = z.object({
    clientId: z.string(),
    filters: z.object({
      searchTerm: z.string().optional(),
    }).optional(),
  });

  private constructor(private readonly _data: z.infer<typeof FindClientInstalledSoftwareCountIn.schema>) {}

  public static create(data: z.infer<typeof FindClientInstalledSoftwareCountIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindClientInstalledSoftwareCountIn.schema,
      failLogMessage: 'FindClientInstalledSoftwareCountIn create factory validation failed',
      factory: (validData) => new FindClientInstalledSoftwareCountIn(validData),
    });
  }

  public get clientId() {
    return this._data.clientId;
  }

  public get filters() {
    return this._data.filters;
  }
}
