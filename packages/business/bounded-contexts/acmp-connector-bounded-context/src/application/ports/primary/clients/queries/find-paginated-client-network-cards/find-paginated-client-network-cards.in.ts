import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindPaginatedClientNetworkCardsIn {
  public static schema = z.object({
    clientId: z.string(),
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
  });

  private constructor(private readonly _data: z.infer<typeof FindPaginatedClientNetworkCardsIn.schema>) {}

  public static create(data: z.infer<typeof FindPaginatedClientNetworkCardsIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindPaginatedClientNetworkCardsIn.schema,
      failLogMessage: 'FindPaginatedClientNetworkCardsIn create factory validation failed',
      factory: (validData) => new FindPaginatedClientNetworkCardsIn(validData),
    });
  }

  public get clientId() {
    return this._data.clientId;
  }

  public get paginationOptions() {
    return this._data.paginationOptions;
  }
}
