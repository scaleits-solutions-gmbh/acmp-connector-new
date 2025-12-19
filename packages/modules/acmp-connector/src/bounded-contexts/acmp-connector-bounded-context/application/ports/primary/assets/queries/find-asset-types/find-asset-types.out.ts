import { acmpAssetTypeListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindAssetTypesOut {
  public static schema = z.array(acmpAssetTypeListItemReadModelSchema);

  private constructor(private readonly _data: z.infer<typeof FindAssetTypesOut.schema>) {}

  public static create(data: z.infer<typeof FindAssetTypesOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindAssetTypesOut.schema,
      failLogMessage: 'FindAssetTypesOut create factory validation failed',
      factory: (validData) => new FindAssetTypesOut(validData),
    });
  }

  public get assetTypes() {
    return this._data;
  }
}
