import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { z } from 'zod';

export class TestDatabaseConnectionCommandIn {
  public static schema = z.object({});

  private constructor(private readonly _data: z.infer<typeof TestDatabaseConnectionCommandIn.schema>) {}

  public static create(data: z.infer<typeof TestDatabaseConnectionCommandIn.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: TestDatabaseConnectionCommandIn.schema,
      failLogMessage: 'TestDatabaseConnectionCommandIn create factory validation failed',
      factory: (validData) => new TestDatabaseConnectionCommandIn(validData),
    });
  }
}
