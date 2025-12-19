import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { ApplyConfigCommandIn } from 'service-configuration/application/ports/primary/config/commands/apply-config/apply-config.command.in';
import { ApplyConfigCommandOut } from 'service-configuration/application/ports/primary/config/commands/apply-config/apply-config.command.out';
import { ApplyConfigCommandPrimaryPort } from 'service-configuration/application/ports/primary/config/commands/apply-config/apply-config.command.port';

export class ApplyConfigCommand extends BaseApi<ApplyConfigCommandIn, ApplyConfigCommandOut> implements ApplyConfigCommandPrimaryPort {
  protected async handle(_input: ApplyConfigCommandIn): Promise<ApplyConfigCommandOut> {
    throw new Error('ApplyConfigCommand not implemented');
  }
}
