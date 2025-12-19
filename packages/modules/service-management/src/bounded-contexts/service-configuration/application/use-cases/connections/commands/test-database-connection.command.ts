import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { TestDatabaseConnectionCommandIn } from 'service-configuration/application/ports/primary/connections/commands/test-database-connection/test-database-connection.command.in';
import { TestDatabaseConnectionCommandOut } from 'service-configuration/application/ports/primary/connections/commands/test-database-connection/test-database-connection.command.out';
import { TestDatabaseConnectionCommandPrimaryPort } from 'service-configuration/application/ports/primary/connections/commands/test-database-connection/test-database-connection.command.port';

export class TestDatabaseConnectionCommand
  extends BaseApi<TestDatabaseConnectionCommandIn, TestDatabaseConnectionCommandOut>
  implements TestDatabaseConnectionCommandPrimaryPort
{
  protected async handle(_input: TestDatabaseConnectionCommandIn): Promise<TestDatabaseConnectionCommandOut> {
    throw new Error('TestDatabaseConnectionCommand not implemented');
  }
}
