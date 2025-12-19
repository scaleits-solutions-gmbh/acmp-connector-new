import { applyConfigHttpBodyResponseSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class ApplyConfigCommandOut {
  public static schema = applyConfigHttpBodyResponseSchema;

  private constructor(private readonly _data: z.infer<typeof ApplyConfigCommandOut.schema>) {}

  public static create(data: z.infer<typeof ApplyConfigCommandOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: ApplyConfigCommandOut.schema,
      failLogMessage: 'ApplyConfigCommandOut create factory validation failed',
      factory: (validData) => new ApplyConfigCommandOut(validData),
    });
  }

  public get ok() {
    return this._data.ok;
  }
}
