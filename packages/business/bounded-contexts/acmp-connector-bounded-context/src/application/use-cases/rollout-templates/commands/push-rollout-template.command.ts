import { PushRolloutTemplateCommandIn } from '@/application/ports/primary/rollout-templates/commands/push-rollout-template/push-rollout-template.command.in';
import { PushRolloutTemplateCommandOut } from '@/application/ports/primary/rollout-templates/commands/push-rollout-template/push-rollout-template.command.out';
import { PushRolloutTemplateCommandPrimaryPort } from '@/application/ports/primary/rollout-templates/commands/push-rollout-template/push-rollout-template.command.port';
import { RolloutTemplateWriteRepositorySecondaryPort } from '@/application/ports/secondary/repositories/rollout-templates/rollout-template.write-repository';

export class PushRolloutTemplateCommand implements PushRolloutTemplateCommandPrimaryPort {
  public constructor(private readonly rolloutTemplateWriteRepository: RolloutTemplateWriteRepositorySecondaryPort) {}

  public async execute(input: PushRolloutTemplateCommandIn): Promise<PushRolloutTemplateCommandOut> {
    const result = await this.rolloutTemplateWriteRepository.pushRolloutTemplate(input.rolloutTemplateId, input.clientIds);

    return PushRolloutTemplateCommandOut.create(result);
  }
}
