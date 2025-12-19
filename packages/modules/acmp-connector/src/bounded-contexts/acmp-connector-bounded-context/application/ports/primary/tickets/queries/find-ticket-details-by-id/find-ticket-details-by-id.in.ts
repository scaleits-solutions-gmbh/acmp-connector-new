import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindTicketDetailsByIdIn {
  public static schema = z.object({
    id: z.string(),
  });

  private constructor(private readonly _data: z.infer<typeof FindTicketDetailsByIdIn.schema>) {}

  public static create(data: z.infer<typeof FindTicketDetailsByIdIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindTicketDetailsByIdIn.schema,
      failLogMessage: 'FindTicketDetailsByIdIn create factory validation failed',
      factory: (validData) => new FindTicketDetailsByIdIn(validData),
    });
  }

  public get id() {
    return this._data.id;
  }
}
