import {
  bootstrapMssqlRepositories,
  bootstrapSicsApiRepositories,
} from '@repo/infrastructure/acmp-connector-infrastructure';

/**
 * Bootstrap all repository implementations from infrastructure layer
 */
export const bootstrapRepositories = {
  ...bootstrapMssqlRepositories,
  ...bootstrapSicsApiRepositories,
};

