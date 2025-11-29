import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindRolloutTemplateByIdIn {
  public static schema = z.object({
    id: z.string(),
  });

  private constructor(private readonly _data: z.infer<typeof FindRolloutTemplateByIdIn.schema>) {}

  public static create(data: z.infer<typeof FindRolloutTemplateByIdIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindRolloutTemplateByIdIn.schema,
      failLogMessage: 'FindRolloutTemplateByIdIn create factory validation failed',
      factory: (validData) => new FindRolloutTemplateByIdIn(validData),
    });
  }

  public get id() {
    return this._data.id;
  }
}
