import { getDashboardHttpBodyResponseSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class GetDashboardOut {
  public static schema = getDashboardHttpBodyResponseSchema;

  private constructor(private readonly _data: z.infer<typeof GetDashboardOut.schema>) {}

  public static create(data: z.infer<typeof GetDashboardOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: GetDashboardOut.schema,
      failLogMessage: 'GetDashboardOut create factory validation failed',
      factory: (validData) => new GetDashboardOut(validData),
    });
  }

  public get dashboard() {
    return this._data;
  }
}
