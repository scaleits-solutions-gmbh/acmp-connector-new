import { testDatabaseConnectionHttpBodyResponseSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class TestDatabaseConnectionCommandOut {
  public static schema = testDatabaseConnectionHttpBodyResponseSchema;

  private constructor(private readonly _data: z.infer<typeof TestDatabaseConnectionCommandOut.schema>) {}

  public static create(data: z.infer<typeof TestDatabaseConnectionCommandOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: TestDatabaseConnectionCommandOut.schema,
      failLogMessage: 'TestDatabaseConnectionCommandOut create factory validation failed',
      factory: (validData) => new TestDatabaseConnectionCommandOut(validData),
    });
  }

  public get status() {
    return this._data.status;
  }

  public get latencyMs() {
    return this._data.latencyMs;
  }
}
