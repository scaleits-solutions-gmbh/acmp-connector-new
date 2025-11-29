import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindAssetTypesIn {
  public static schema = z.object({
  });

  private constructor(private readonly _data: z.infer<typeof FindAssetTypesIn.schema>) {}

  public static create(data: z.infer<typeof FindAssetTypesIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindAssetTypesIn.schema,
      failLogMessage: 'FindAssetTypesIn create factory validation failed',
      factory: (validData) => new FindAssetTypesIn(validData),
    });
  }

}
