import { acmpClientHardDriveListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { z } from 'zod';

export class FindPaginatedClientHardDrivesOut {
  public static schema = paginatedDataSchema({
    dataItemSchema: acmpClientHardDriveListItemReadModelSchema,
    zodClient: z,
  });

  private constructor(private readonly _data: z.infer<typeof FindPaginatedClientHardDrivesOut.schema>) {}

  public static create(data: z.infer<typeof FindPaginatedClientHardDrivesOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindPaginatedClientHardDrivesOut.schema,
      failLogMessage: 'FindPaginatedClientHardDrivesOut create factory validation failed',
      factory: (validData) => new FindPaginatedClientHardDrivesOut(validData),
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
