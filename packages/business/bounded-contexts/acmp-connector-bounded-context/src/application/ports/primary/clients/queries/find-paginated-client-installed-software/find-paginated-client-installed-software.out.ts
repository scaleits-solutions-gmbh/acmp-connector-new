import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';
import { acmpClientInstalledSoftwareListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';

export class FindPaginatedClientInstalledSoftwareOut {
  public static schema = paginatedDataSchema({
    dataItemSchema: acmpClientInstalledSoftwareListItemReadModelSchema,
    zodClient: z,
  });

  private constructor(private readonly _data: z.infer<typeof FindPaginatedClientInstalledSoftwareOut.schema>) {}

  public static create(data: z.infer<typeof FindPaginatedClientInstalledSoftwareOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindPaginatedClientInstalledSoftwareOut.schema,
      failLogMessage: 'FindPaginatedClientInstalledSoftwareOut create factory validation failed',
      factory: (validData) => new FindPaginatedClientInstalledSoftwareOut(validData),
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
