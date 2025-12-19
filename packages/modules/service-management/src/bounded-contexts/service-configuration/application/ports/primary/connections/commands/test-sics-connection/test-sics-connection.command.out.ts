import { testSicsConnectionHttpBodyResponseSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class TestSicsConnectionCommandOut {
  public static schema = testSicsConnectionHttpBodyResponseSchema;

  private constructor(private readonly _data: z.infer<typeof TestSicsConnectionCommandOut.schema>) {}

  public static create(data: z.infer<typeof TestSicsConnectionCommandOut.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: TestSicsConnectionCommandOut.schema,
      failLogMessage: 'TestSicsConnectionCommandOut create factory validation failed',
      factory: (validData) => new TestSicsConnectionCommandOut(validData),
    });
  }

  public get status() {
    return this._data.status;
  }

  public get latencyMs() {
    return this._data.latencyMs;
  }
}
