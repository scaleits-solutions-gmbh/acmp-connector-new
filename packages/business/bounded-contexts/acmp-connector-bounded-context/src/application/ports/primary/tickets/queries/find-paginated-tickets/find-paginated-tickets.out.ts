import { acmpTicketListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { z } from 'zod';

export class FindPaginatedTicketsOut {
  public static schema = paginatedDataSchema({
    dataItemSchema: acmpTicketListItemReadModelSchema,
    zodClient: z,
  });

  private constructor(private readonly _data: z.infer<typeof FindPaginatedTicketsOut.schema>) {}

  public static create(data: z.infer<typeof FindPaginatedTicketsOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindPaginatedTicketsOut.schema,
      failLogMessage: 'FindPaginatedTicketsOut create factory validation failed',
      factory: (validData) => new FindPaginatedTicketsOut(validData),
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
