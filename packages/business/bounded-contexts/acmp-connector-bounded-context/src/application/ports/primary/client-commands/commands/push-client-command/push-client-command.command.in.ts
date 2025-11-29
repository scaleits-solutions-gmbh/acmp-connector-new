import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';


export class PushClientCommandCommandIn {
  public static schema = z.object({
    clientCommandId: z.string(),
    clientIds: z.array(z.string()),
  });

  private constructor(private readonly _data: z.infer<typeof PushClientCommandCommandIn.schema>) {}

  public static create(data: z.infer<typeof PushClientCommandCommandIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: PushClientCommandCommandIn.schema,
      failLogMessage: 'PushClientCommandCommandIn create factory validation failed',
      factory: (validData) => new PushClientCommandCommandIn(validData),
    });
  }

  public get clientCommandId() {
    return this._data.clientCommandId;
  }

  public get clientIds() {
    return this._data.clientIds;
  }
}
