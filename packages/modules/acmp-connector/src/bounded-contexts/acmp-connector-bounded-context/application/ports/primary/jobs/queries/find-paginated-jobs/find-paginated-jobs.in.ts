import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindPaginatedJobsIn {
  public static schema = z.object({
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
    filters: z
      .object({
        searchTerm: z.string().optional(),
        kind: z.string().optional(),
        origin: z.string().optional(),
      })
      .optional(),
  });

  private constructor(private readonly _data: z.infer<typeof FindPaginatedJobsIn.schema>) {}

  public static create(data: z.infer<typeof FindPaginatedJobsIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindPaginatedJobsIn.schema,
      failLogMessage: 'FindPaginatedJobsIn create factory validation failed',
      factory: (validData) => new FindPaginatedJobsIn(validData),
    });
  }

  public get paginationOptions() {
    return this._data.paginationOptions;
  }

  public get filters() {
    return this._data.filters;
  }
}
