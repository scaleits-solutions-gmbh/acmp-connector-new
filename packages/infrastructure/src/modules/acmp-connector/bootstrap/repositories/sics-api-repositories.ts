import { SicsApiClientCommandWriteRepository } from 'acmp-connector/repositories/sics-api/client-command.write-repository';
import { SicsApiRolloutTemplateWriteRepository } from 'acmp-connector/repositories/sics-api/rollout-template.write-repository';

/**
 * Bootstrap SICS API repository instances.
 */
export const bootstrapSicsApiRepositories = {
  clientCommandWriteRepository: new SicsApiClientCommandWriteRepository(),
  rolloutTemplateWriteRepository: new SicsApiRolloutTemplateWriteRepository(),
};
