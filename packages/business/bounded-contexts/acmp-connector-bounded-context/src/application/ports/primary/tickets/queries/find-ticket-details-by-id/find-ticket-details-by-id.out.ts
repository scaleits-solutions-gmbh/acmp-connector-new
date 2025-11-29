import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';
import { acmpTicketDetailsReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export class FindTicketDetailsByIdOut {
  public static schema = acmpTicketDetailsReadModelSchema;

  private constructor(private readonly _data: z.infer<typeof FindTicketDetailsByIdOut.schema>) {}

  public static create(data: z.infer<typeof FindTicketDetailsByIdOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindTicketDetailsByIdOut.schema,
      failLogMessage: 'FindTicketDetailsByIdOut create factory validation failed',
      factory: (validData) => new FindTicketDetailsByIdOut(validData),
    });
  }

  public get ticketDetails() {
    return this._data;
  }
}
