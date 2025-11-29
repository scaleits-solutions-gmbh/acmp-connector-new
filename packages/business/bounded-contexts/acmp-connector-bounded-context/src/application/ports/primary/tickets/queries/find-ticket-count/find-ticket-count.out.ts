import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';


export class FindTicketCountOut {
  public static schema = z.object({
    count: z.number(),
  });

  private constructor(private readonly _data: z.infer<typeof FindTicketCountOut.schema>) {}

  public static create(data: z.infer<typeof FindTicketCountOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindTicketCountOut.schema,
      failLogMessage: 'FindTicketCountOut create factory validation failed',
      factory: (validData) => new FindTicketCountOut(validData),
    });
  }

  public get count() {
    return this._data.count;
  }
}
