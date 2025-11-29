import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';
import { acmpJobReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export class FindJobByIdOut {
  public static schema = acmpJobReadModelSchema;

  private constructor(private readonly _data: z.infer<typeof FindJobByIdOut.schema>) {}

  public static create(data: z.infer<typeof FindJobByIdOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindJobByIdOut.schema,
      failLogMessage: 'FindJobByIdOut create factory validation failed',
      factory: (validData) => new FindJobByIdOut(validData),
    });
  }

  public get job() {
    return this._data;
  }
}
