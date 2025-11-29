import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';
import { acmpAssetListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export class FindAssetByIdOut {
  public static schema = acmpAssetListItemReadModelSchema;

  private constructor(private readonly _data: z.infer<typeof FindAssetByIdOut.schema>) {}

  public static create(data: z.infer<typeof FindAssetByIdOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindAssetByIdOut.schema,
      failLogMessage: 'FindAssetByIdOut create factory validation failed',
      factory: (validData) => new FindAssetByIdOut(validData),
    });
  }

  public get asset() {
    return this._data;
  }
}
