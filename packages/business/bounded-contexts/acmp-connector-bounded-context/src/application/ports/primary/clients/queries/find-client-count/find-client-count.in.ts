import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindClientCountIn {
  public static schema = z.object({
    filters: z.object({
      searchTerm: z.string().optional(),
      tenantId: z.string().optional(),
    }).optional(),
  });

  private constructor(private readonly _data: z.infer<typeof FindClientCountIn.schema>) {}

  public static create(data: z.infer<typeof FindClientCountIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindClientCountIn.schema,
      failLogMessage: 'FindClientCountIn create factory validation failed',
      factory: (validData) => new FindClientCountIn(validData),
    });
  }

  public get filters() {
    return this._data.filters;
  }
}
