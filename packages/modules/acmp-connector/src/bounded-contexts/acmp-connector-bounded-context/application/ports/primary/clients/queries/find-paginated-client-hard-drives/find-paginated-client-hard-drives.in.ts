import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindPaginatedClientHardDrivesIn {
  public static schema = z.object({
    clientId: z.string(),
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
  });

  private constructor(private readonly _data: z.infer<typeof FindPaginatedClientHardDrivesIn.schema>) {}

  public static create(data: z.infer<typeof FindPaginatedClientHardDrivesIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindPaginatedClientHardDrivesIn.schema,
      failLogMessage: 'FindPaginatedClientHardDrivesIn create factory validation failed',
      factory: (validData) => new FindPaginatedClientHardDrivesIn(validData),
    });
  }

  public get clientId() {
    return this._data.clientId;
  }

  public get paginationOptions() {
    return this._data.paginationOptions;
  }
}
