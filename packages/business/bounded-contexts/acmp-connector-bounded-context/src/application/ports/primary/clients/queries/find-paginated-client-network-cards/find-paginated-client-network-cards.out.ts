import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';
import { acmpClientNetworkCardListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';

export class FindPaginatedClientNetworkCardsOut {
  public static schema = paginatedDataSchema({
    dataItemSchema: acmpClientNetworkCardListItemReadModelSchema,
    zodClient: z,
  });

  private constructor(private readonly _data: z.infer<typeof FindPaginatedClientNetworkCardsOut.schema>) {}

  public static create(data: z.infer<typeof FindPaginatedClientNetworkCardsOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindPaginatedClientNetworkCardsOut.schema,
      failLogMessage: 'FindPaginatedClientNetworkCardsOut create factory validation failed',
      factory: (validData) => new FindPaginatedClientNetworkCardsOut(validData),
    });
  }

  public get data() {
    return this._data.data;
  }

  public get total() {
    return this._data.total;
  }

  public get page() {
    return this._data.page;
  }

  public get pageSize() {
    return this._data.pageSize;
  }

  public get totalPages() {
    return this._data.totalPages;
  }
}
