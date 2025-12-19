import { acmpAssetListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { z } from 'zod';

export class FindPaginatedAssetsOut {
  public static schema = paginatedDataSchema({
    dataItemSchema: acmpAssetListItemReadModelSchema,
    zodClient: z,
  });

  private constructor(private readonly _data: z.infer<typeof FindPaginatedAssetsOut.schema>) {}

  public static create(data: z.infer<typeof FindPaginatedAssetsOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindPaginatedAssetsOut.schema,
      failLogMessage: 'FindPaginatedAssetsOut create factory validation failed',
      factory: (validData) => new FindPaginatedAssetsOut(validData),
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
