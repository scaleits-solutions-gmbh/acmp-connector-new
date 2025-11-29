import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindRolloutTemplateCountIn {
  public static schema = z.object({
    filters: z.object({
      searchTerm: z.string().optional(),
      os: z.string().optional(),
    }).optional(),
  });

  private constructor(private readonly _data: z.infer<typeof FindRolloutTemplateCountIn.schema>) {}

  public static create(data: z.infer<typeof FindRolloutTemplateCountIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindRolloutTemplateCountIn.schema,
      failLogMessage: 'FindRolloutTemplateCountIn create factory validation failed',
      factory: (validData) => new FindRolloutTemplateCountIn(validData),
    });
  }

  public get filters() {
    return this._data.filters;
  }
}
