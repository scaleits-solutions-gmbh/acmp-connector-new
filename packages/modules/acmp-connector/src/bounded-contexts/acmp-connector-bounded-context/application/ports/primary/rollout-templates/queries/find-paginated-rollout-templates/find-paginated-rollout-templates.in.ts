import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindPaginatedRolloutTemplatesIn {
  public static schema = z.object({
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
    filters: z
      .object({
        searchTerm: z.string().optional(),
        os: z.string().optional(),
      })
      .optional(),
  });

  private constructor(private readonly _data: z.infer<typeof FindPaginatedRolloutTemplatesIn.schema>) {}

  public static create(data: z.infer<typeof FindPaginatedRolloutTemplatesIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindPaginatedRolloutTemplatesIn.schema,
      failLogMessage: 'FindPaginatedRolloutTemplatesIn create factory validation failed',
      factory: (validData) => new FindPaginatedRolloutTemplatesIn(validData),
    });
  }

  public get paginationOptions() {
    return this._data.paginationOptions;
  }

  public get filters() {
    return this._data.filters;
  }
}
