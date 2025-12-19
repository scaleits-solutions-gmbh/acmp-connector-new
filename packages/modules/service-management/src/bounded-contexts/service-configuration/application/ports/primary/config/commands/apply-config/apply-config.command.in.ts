import { applyConfigHttpBodyRequestSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class ApplyConfigCommandIn {
  public static schema = applyConfigHttpBodyRequestSchema;

  private constructor(private readonly _data: z.infer<typeof ApplyConfigCommandIn.schema>) {}

  public static create(data: z.infer<typeof ApplyConfigCommandIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: ApplyConfigCommandIn.schema,
      failLogMessage: 'ApplyConfigCommandIn create factory validation failed',
      factory: (validData) => new ApplyConfigCommandIn(validData),
    });
  }

  public get config() {
    return this._data;
  }
}
