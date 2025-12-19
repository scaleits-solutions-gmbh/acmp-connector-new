import { getConfigHttpBodyResponseSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class GetConfigOut {
  public static schema = getConfigHttpBodyResponseSchema;

  private constructor(private readonly _data: z.infer<typeof GetConfigOut.schema>) {}

  public static create(data: z.infer<typeof GetConfigOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: GetConfigOut.schema,
      failLogMessage: 'GetConfigOut create factory validation failed',
      factory: (validData) => new GetConfigOut(validData),
    });
  }

  public get config() {
    return this._data;
  }
}
