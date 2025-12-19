import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class GetDashboardIn {
  public static schema = z.object({});

  private constructor(private readonly _data: z.infer<typeof GetDashboardIn.schema>) {}

  public static create(data: z.infer<typeof GetDashboardIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: GetDashboardIn.schema,
      failLogMessage: 'GetDashboardIn create factory validation failed',
      factory: (validData) => new GetDashboardIn(validData),
    });
  }
}
