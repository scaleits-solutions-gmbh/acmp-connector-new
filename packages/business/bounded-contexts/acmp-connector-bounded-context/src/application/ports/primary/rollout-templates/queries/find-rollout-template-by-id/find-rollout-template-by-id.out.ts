import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';
import { acmpRolloutTemplateListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export class FindRolloutTemplateByIdOut {
  public static schema = acmpRolloutTemplateListItemReadModelSchema;

  private constructor(private readonly _data: z.infer<typeof FindRolloutTemplateByIdOut.schema>) {}

  public static create(data: z.infer<typeof FindRolloutTemplateByIdOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindRolloutTemplateByIdOut.schema,
      failLogMessage: 'FindRolloutTemplateByIdOut create factory validation failed',
      factory: (validData) => new FindRolloutTemplateByIdOut(validData),
    });
  }

  public get rolloutTemplate() {
    return this._data;
  }
}
