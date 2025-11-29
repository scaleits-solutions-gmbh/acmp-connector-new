import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindJobCountIn {
  public static schema = z.object({
    filters: z.object({
      searchTerm: z.string().optional(),
      kind: z.string().optional(),
      origin: z.string().optional(),
    }).optional(),
  });

  private constructor(private readonly _data: z.infer<typeof FindJobCountIn.schema>) {}

  public static create(data: z.infer<typeof FindJobCountIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindJobCountIn.schema,
      failLogMessage: 'FindJobCountIn create factory validation failed',
      factory: (validData) => new FindJobCountIn(validData),
    });
  }

  public get filters() {
    return this._data.filters;
  }
}
