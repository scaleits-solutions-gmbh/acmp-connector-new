import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindClientCommandByIdIn {
  public static schema = z.object({
    id: z.string(),
  });

  private constructor(private readonly _data: z.infer<typeof FindClientCommandByIdIn.schema>) {}

  public static create(data: z.infer<typeof FindClientCommandByIdIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindClientCommandByIdIn.schema,
      failLogMessage: 'FindClientCommandByIdIn create factory validation failed',
      factory: (validData) => new FindClientCommandByIdIn(validData),
    });
  }

  public get id() {
    return this._data.id;
  }
}
