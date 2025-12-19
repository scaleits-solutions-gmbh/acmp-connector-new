import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class TestSicsConnectionCommandIn {
  public static schema = z.object({});

  private constructor(private readonly _data: z.infer<typeof TestSicsConnectionCommandIn.schema>) {}

  public static create(data: z.infer<typeof TestSicsConnectionCommandIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: TestSicsConnectionCommandIn.schema,
      failLogMessage: 'TestSicsConnectionCommandIn create factory validation failed',
      factory: (validData) => new TestSicsConnectionCommandIn(validData),
    });
  }
}
