import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindJobByIdIn {
  public static schema = z.object({
    id: z.string(),
  });

  private constructor(private readonly _data: z.infer<typeof FindJobByIdIn.schema>) {}

  public static create(data: z.infer<typeof FindJobByIdIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindJobByIdIn.schema,
      failLogMessage: 'FindJobByIdIn create factory validation failed',
      factory: (validData) => new FindJobByIdIn(validData),
    });
  }

  public get id() {
    return this._data.id;
  }
}
