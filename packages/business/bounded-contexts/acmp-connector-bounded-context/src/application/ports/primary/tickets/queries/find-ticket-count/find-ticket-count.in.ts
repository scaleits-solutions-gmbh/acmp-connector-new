import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindTicketCountIn {
  public static schema = z.object({
    filters: z.object({
      searchTerm: z.string().optional(),
    }).optional(),
  });

  private constructor(private readonly _data: z.infer<typeof FindTicketCountIn.schema>) {}

  public static create(data: z.infer<typeof FindTicketCountIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindTicketCountIn.schema,
      failLogMessage: 'FindTicketCountIn create factory validation failed',
      factory: (validData) => new FindTicketCountIn(validData),
    });
  }

  public get filters() {
    return this._data.filters;
  }
}
