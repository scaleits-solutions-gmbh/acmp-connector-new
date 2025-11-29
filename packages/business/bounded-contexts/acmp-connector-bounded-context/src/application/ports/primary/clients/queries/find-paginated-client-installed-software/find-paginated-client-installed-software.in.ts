import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindPaginatedClientInstalledSoftwareIn {
  public static schema = z.object({
    clientId: z.string(),
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
    filters: z.object({
      searchTerm: z.string().optional(),
    }).optional(),
  });

  private constructor(private readonly _data: z.infer<typeof FindPaginatedClientInstalledSoftwareIn.schema>) {}

  public static create(data: z.infer<typeof FindPaginatedClientInstalledSoftwareIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindPaginatedClientInstalledSoftwareIn.schema,
      failLogMessage: 'FindPaginatedClientInstalledSoftwareIn create factory validation failed',
      factory: (validData) => new FindPaginatedClientInstalledSoftwareIn(validData),
    });
  }

  public get clientId() {
    return this._data.clientId;
  }

  public get paginationOptions() {
    return this._data.paginationOptions;
  }

  public get filters() {
    return this._data.filters;
  }
}
