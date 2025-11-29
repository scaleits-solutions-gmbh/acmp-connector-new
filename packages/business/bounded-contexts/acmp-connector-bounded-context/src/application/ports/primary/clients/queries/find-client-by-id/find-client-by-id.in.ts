import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindClientByIdIn {
  public static schema = z.object({
    id: z.string(),
  });

  private constructor(private readonly _data: z.infer<typeof FindClientByIdIn.schema>) {}

  public static create(data: z.infer<typeof FindClientByIdIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindClientByIdIn.schema,
      failLogMessage: 'FindClientByIdIn create factory validation failed',
      factory: (validData) => new FindClientByIdIn(validData),
    });
  }

  public get id() {
    return this._data.id;
  }
}
