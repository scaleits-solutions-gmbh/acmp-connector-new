import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class PushRolloutTemplateCommandOut {
  public static schema = z.object({
    success: z.boolean(),
    jobId: z.string().optional(),
  });

  private constructor(private readonly _data: z.infer<typeof PushRolloutTemplateCommandOut.schema>) {}

  public static create(data: z.infer<typeof PushRolloutTemplateCommandOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: PushRolloutTemplateCommandOut.schema,
      failLogMessage: 'PushRolloutTemplateCommandOut create factory validation failed',
      factory: (validData) => new PushRolloutTemplateCommandOut(validData),
    });
  }

  public get success() {
    return this._data.success;
  }

  public get jobId() {
    return this._data.jobId;
  }
}
