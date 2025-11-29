import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindAssetByIdIn {
  public static schema = z.object({
    id: z.string(),
  });

  private constructor(private readonly _data: z.infer<typeof FindAssetByIdIn.schema>) {}

  public static create(data: z.infer<typeof FindAssetByIdIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindAssetByIdIn.schema,
      failLogMessage: 'FindAssetByIdIn create factory validation failed',
      factory: (validData) => new FindAssetByIdIn(validData),
    });
  }

  public get id() {
    return this._data.id;
  }
}