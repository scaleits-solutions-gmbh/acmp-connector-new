import { PushRolloutTemplateCommandIn } from './push-rollout-template.command.in';
import { PushRolloutTemplateCommandOut } from './push-rollout-template.command.out';

export interface PushRolloutTemplateCommandPrimaryPort {
  execute(input: PushRolloutTemplateCommandIn): Promise<PushRolloutTemplateCommandOut>;
}
