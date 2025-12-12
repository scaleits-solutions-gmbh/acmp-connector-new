import { acmpTicketListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class FindTicketByIdOut {
  public static schema = acmpTicketListItemReadModelSchema;

  private constructor(private readonly _data: z.infer<typeof FindTicketByIdOut.schema>) {}

  public static create(data: z.infer<typeof FindTicketByIdOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindTicketByIdOut.schema,
      failLogMessage: 'FindTicketByIdOut create factory validation failed',
      factory: (validData) => new FindTicketByIdOut(validData),
    });
  }

  public get ticket() {
    return this._data;
  }
}
