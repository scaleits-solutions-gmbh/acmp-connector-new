import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';


export class PushRolloutTemplateCommandIn {
  public static schema = z.object({
    rolloutTemplateId: z.string(),
    clientIds: z.array(z.string()),
  });

  private constructor(private readonly _data: z.infer<typeof PushRolloutTemplateCommandIn.schema>) {}

  public static create(data: z.infer<typeof PushRolloutTemplateCommandIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: PushRolloutTemplateCommandIn.schema,
      failLogMessage: 'PushRolloutTemplateCommandIn create factory validation failed',
      factory: (validData) => new PushRolloutTemplateCommandIn(validData),
    });
  }

  public get rolloutTemplateId() {
    return this._data.rolloutTemplateId;
  }

  public get clientIds() {
    return this._data.clientIds;
  }
}
