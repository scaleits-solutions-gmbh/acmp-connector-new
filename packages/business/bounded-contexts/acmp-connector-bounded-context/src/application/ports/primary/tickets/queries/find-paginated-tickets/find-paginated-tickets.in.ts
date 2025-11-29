import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindPaginatedTicketsIn {
  public static schema = z.object({
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
    filters: z.object({
      searchTerm: z.string().optional(),
    }).optional(),
  });

  private constructor(private readonly _data: z.infer<typeof FindPaginatedTicketsIn.schema>) {}

  public static create(data: z.infer<typeof FindPaginatedTicketsIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindPaginatedTicketsIn.schema,
      failLogMessage: 'FindPaginatedTicketsIn create factory validation failed',
      factory: (validData) => new FindPaginatedTicketsIn(validData),
    });
  }

  public get paginationOptions() {
    return this._data.paginationOptions;
  }

  public get filters() {
    return this._data.filters;
  }
}
