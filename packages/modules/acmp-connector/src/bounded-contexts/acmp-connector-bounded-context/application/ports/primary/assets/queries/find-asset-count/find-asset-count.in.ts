import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindAssetCountIn {
  public static schema = z.object({
    filters: z
      .object({
        searchTerm: z.string().optional(),
        assetType: z.string().optional(),
      })
      .optional(),
  });

  private constructor(private readonly _data: z.infer<typeof FindAssetCountIn.schema>) {}

  public static create(data: z.infer<typeof FindAssetCountIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindAssetCountIn.schema,
      failLogMessage: 'FindAssetCountIn create factory validation failed',
      factory: (validData) => new FindAssetCountIn(validData),
    });
  }

  public get filters() {
    return this._data.filters;
  }
}
