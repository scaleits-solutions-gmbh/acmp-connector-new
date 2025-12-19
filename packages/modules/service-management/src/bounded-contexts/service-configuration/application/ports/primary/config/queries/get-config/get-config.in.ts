import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class GetConfigIn {
  public static schema = z.object({});

  private constructor(private readonly _data: z.infer<typeof GetConfigIn.schema>) {}

  public static create(data: z.infer<typeof GetConfigIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: GetConfigIn.schema,
      failLogMessage: 'GetConfigIn create factory validation failed',
      factory: (validData) => new GetConfigIn(validData),
    });
  }
}
