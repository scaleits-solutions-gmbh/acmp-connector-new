import { acmpClientReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindClientByIdOut {
  public static schema = acmpClientReadModelSchema;

  private constructor(private readonly _data: z.infer<typeof FindClientByIdOut.schema>) {}

  public static create(data: z.infer<typeof FindClientByIdOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindClientByIdOut.schema,
      failLogMessage: 'FindClientByIdOut create factory validation failed',
      factory: (validData) => new FindClientByIdOut(validData),
    });
  }

  public get client() {
    return this._data;
  }
}
