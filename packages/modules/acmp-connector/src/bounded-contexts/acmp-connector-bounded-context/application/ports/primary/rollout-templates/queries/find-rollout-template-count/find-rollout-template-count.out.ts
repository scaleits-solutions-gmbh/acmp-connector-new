import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindRolloutTemplateCountOut {
  public static schema = z.object({
    count: z.number(),
  });

  private constructor(private readonly _data: z.infer<typeof FindRolloutTemplateCountOut.schema>) {}

  public static create(data: z.infer<typeof FindRolloutTemplateCountOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindRolloutTemplateCountOut.schema,
      failLogMessage: 'FindRolloutTemplateCountOut create factory validation failed',
      factory: (validData) => new FindRolloutTemplateCountOut(validData),
    });
  }

  public get count() {
    return this._data.count;
  }
}
