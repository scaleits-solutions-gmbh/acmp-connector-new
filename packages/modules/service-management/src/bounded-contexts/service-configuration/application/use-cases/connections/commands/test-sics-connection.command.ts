import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { TestSicsConnectionCommandIn } from 'service-configuration/application/ports/primary/connections/commands/test-sics-connection/test-sics-connection.command.in';
import { TestSicsConnectionCommandOut } from 'service-configuration/application/ports/primary/connections/commands/test-sics-connection/test-sics-connection.command.out';
import { TestSicsConnectionCommandPrimaryPort } from 'service-configuration/application/ports/primary/connections/commands/test-sics-connection/test-sics-connection.command.port';

export class TestSicsConnectionCommand
  extends BaseApi<TestSicsConnectionCommandIn, TestSicsConnectionCommandOut>
  implements TestSicsConnectionCommandPrimaryPort
{
  protected async handle(_input: TestSicsConnectionCommandIn): Promise<TestSicsConnectionCommandOut> {
    throw new Error('TestSicsConnectionCommand not implemented');
  }
}
