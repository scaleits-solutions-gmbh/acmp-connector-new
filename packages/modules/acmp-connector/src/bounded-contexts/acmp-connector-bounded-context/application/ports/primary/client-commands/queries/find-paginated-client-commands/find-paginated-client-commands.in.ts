import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindPaginatedClientCommandsIn {
  public static schema = z.object({
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
    filters: z
      .object({
        searchTerm: z.string().optional(),
      })
      .optional(),
  });

  private constructor(private readonly _data: z.infer<typeof FindPaginatedClientCommandsIn.schema>) {}

  public static create(data: z.infer<typeof FindPaginatedClientCommandsIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindPaginatedClientCommandsIn.schema,
      failLogMessage: 'FindPaginatedClientCommandsIn create factory validation failed',
      factory: (validData) => new FindPaginatedClientCommandsIn(validData),
    });
  }

  public get paginationOptions() {
    return this._data.paginationOptions;
  }

  public get filters() {
    return this._data.filters;
  }
}
