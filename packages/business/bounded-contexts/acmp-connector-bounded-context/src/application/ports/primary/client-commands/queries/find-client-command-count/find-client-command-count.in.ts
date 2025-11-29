import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindClientCommandCountIn {
  public static schema = z.object({
    filters: z.object({
      searchTerm: z.string().optional(),
    }).optional(),
  });

  private constructor(private readonly _data: z.infer<typeof FindClientCommandCountIn.schema>) {}

  public static create(data: z.infer<typeof FindClientCommandCountIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindClientCommandCountIn.schema,
      failLogMessage: 'FindClientCommandCountIn create factory validation failed',
      factory: (validData) => new FindClientCommandCountIn(validData),
    });
  }

  public get filters() {
    return this._data.filters;
  }
}
