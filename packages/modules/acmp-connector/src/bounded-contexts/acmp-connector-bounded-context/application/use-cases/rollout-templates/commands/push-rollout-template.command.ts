import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { PushRolloutTemplateCommandIn } from 'acmp-connector-bounded-context/application/ports/primary/rollout-templates/commands/push-rollout-template/push-rollout-template.command.in';
import { PushRolloutTemplateCommandOut } from 'acmp-connector-bounded-context/application/ports/primary/rollout-templates/commands/push-rollout-template/push-rollout-template.command.out';
import { PushRolloutTemplateCommandPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/rollout-templates/commands/push-rollout-template/push-rollout-template.command.port';
import { RolloutTemplateWriteRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/rollout-templates/rollout-template.write-repository';

export class PushRolloutTemplateCommand extends BaseApi<PushRolloutTemplateCommandIn, PushRolloutTemplateCommandOut> implements PushRolloutTemplateCommandPrimaryPort {
  public constructor(private readonly rolloutTemplateWriteRepository: RolloutTemplateWriteRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: PushRolloutTemplateCommandIn): Promise<PushRolloutTemplateCommandOut> {
    const result = await this.rolloutTemplateWriteRepository.pushRolloutTemplate(input.rolloutTemplateId, input.clientIds);

    return PushRolloutTemplateCommandOut.create(result);
  }
}
