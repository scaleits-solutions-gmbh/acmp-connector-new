import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindPaginatedAssetsIn {
  public static schema = z.object({
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
    filters: z.object({
      searchTerm: z.string().optional(),
      assetType: z.string().optional(),
    }).optional(),
  });

  private constructor(private readonly _data: z.infer<typeof FindPaginatedAssetsIn.schema>) {}

  public static create(data: z.infer<typeof FindPaginatedAssetsIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindPaginatedAssetsIn.schema,
      failLogMessage: 'FindPaginatedAssetsIn create factory validation failed',
      factory: (validData) => new FindPaginatedAssetsIn(validData),
    });
  }

  public get paginationOptions() {
    return this._data.paginationOptions;
  }

  public get filters() {
    return this._data.filters;
  }
}
