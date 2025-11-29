import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';


export class PushClientCommandCommandOut {
  public static schema = z.object({
    success: z.boolean(),
    jobId: z.string().optional(),
  });

  private constructor(private readonly _data: z.infer<typeof PushClientCommandCommandOut.schema>) {}

  public static create(data: z.infer<typeof PushClientCommandCommandOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: PushClientCommandCommandOut.schema,
      failLogMessage: 'PushClientCommandCommandOut create factory validation failed',
      factory: (validData) => new PushClientCommandCommandOut(validData),
    });
  }

  public get success() {
    return this._data.success;
  }

  public get jobId() {
    return this._data.jobId;
  }
}
