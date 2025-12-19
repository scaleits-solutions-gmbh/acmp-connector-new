import {
  bootstrapMssqlRepositories,
  bootstrapSicsApiRepositories,
} from "@repo/infrastructure";

/**
 * Bootstrap all repository implementations from infrastructure layer
 */
export const bootstrapRepositories = {
  ...bootstrapMssqlRepositories,
  ...bootstrapSicsApiRepositories,
};
