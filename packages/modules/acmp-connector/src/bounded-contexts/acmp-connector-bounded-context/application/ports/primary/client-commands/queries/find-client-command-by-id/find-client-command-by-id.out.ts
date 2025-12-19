import { acmpClientCommandReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindClientCommandByIdOut {
  public static schema = acmpClientCommandReadModelSchema;

  private constructor(private readonly _data: z.infer<typeof FindClientCommandByIdOut.schema>) {}

  public static create(data: z.infer<typeof FindClientCommandByIdOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindClientCommandByIdOut.schema,
      failLogMessage: 'FindClientCommandByIdOut create factory validation failed',
      factory: (validData) => new FindClientCommandByIdOut(validData),
    });
  }

  public get clientCommand() {
    return this._data;
  }
}
