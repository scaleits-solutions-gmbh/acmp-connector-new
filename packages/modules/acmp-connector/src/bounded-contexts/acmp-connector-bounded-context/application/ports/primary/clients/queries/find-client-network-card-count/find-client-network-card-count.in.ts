import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class FindClientNetworkCardCountIn {
  public static schema = z.object({
    clientId: z.string(),
  });

  private constructor(private readonly _data: z.infer<typeof FindClientNetworkCardCountIn.schema>) {}

  public static create(data: z.infer<typeof FindClientNetworkCardCountIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: FindClientNetworkCardCountIn.schema,
      failLogMessage: 'FindClientNetworkCardCountIn create factory validation failed',
      factory: (validData) => new FindClientNetworkCardCountIn(validData),
    });
  }

  public get clientId() {
    return this._data.clientId;
  }
}
