import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindTicketByIdIn {
  public static schema = z.object({
    id: z.string(),
  });

  private constructor(private readonly _data: z.infer<typeof FindTicketByIdIn.schema>) {}

  public static create(data: z.infer<typeof FindTicketByIdIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindTicketByIdIn.schema,
      failLogMessage: 'FindTicketByIdIn create factory validation failed',
      factory: (validData) => new FindTicketByIdIn(validData),
    });
  }

  public get id() {
    return this._data.id;
  }
}
