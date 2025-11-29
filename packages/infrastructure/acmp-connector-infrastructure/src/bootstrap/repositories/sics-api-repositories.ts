import { SicsApiClientCommandWriteRepository } from '@/repositories/sics-api/client-command.write-repository';
import { SicsApiRolloutTemplateWriteRepository } from '@/repositories/sics-api/rollout-template.write-repository';

/**
 * Bootstrap SICS API repository instances.
 */
export const bootstrapSicsApiRepositories = {
  clientCommandWriteRepository: new SicsApiClientCommandWriteRepository(),
  rolloutTemplateWriteRepository: new SicsApiRolloutTemplateWriteRepository(),
};

