import { acmpJobReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { z } from 'zod';

export class FindPaginatedJobsOut {
  public static schema = paginatedDataSchema({
    dataItemSchema: acmpJobReadModelSchema,
    zodClient: z,
  });

  private constructor(private readonly _data: z.infer<typeof FindPaginatedJobsOut.schema>) {}

  public static create(data: z.infer<typeof FindPaginatedJobsOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindPaginatedJobsOut.schema,
      failLogMessage: 'FindPaginatedJobsOut create factory validation failed',
      factory: (validData) => new FindPaginatedJobsOut(validData),
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
