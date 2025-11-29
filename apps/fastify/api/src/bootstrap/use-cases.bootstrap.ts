import {
  // Clients
  FindPaginatedClientsQuery,
  FindClientByIdQuery,
  FindPaginatedClientHardDrivesQuery,
  FindPaginatedClientNetworkCardsQuery,
  FindPaginatedClientInstalledSoftwareQuery,
  // Jobs
  FindPaginatedJobsQuery,
  // Tickets
  FindPaginatedTicketsQuery,
  FindTicketByIdQuery,
  // Assets
  FindPaginatedAssetsQuery,
  FindAssetByIdQuery,
  FindAssetTypesQuery,
  // Client Commands
  FindPaginatedClientCommandsQuery,
  FindClientCommandByIdQuery,
  PushClientCommandCommand,
  // Rollout Templates
  FindPaginatedRolloutTemplatesQuery,
  FindRolloutTemplateByIdQuery,
  PushRolloutTemplateCommand,
} from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { bootstrapRepositories } from '@/bootstrap/repositories.bootstrap';

/**
 * Bootstrap all use cases with their dependencies injected
 */
export const bootstrapUseCases = {
  // Clients
  findPaginatedClientsQuery: new FindPaginatedClientsQuery(
    bootstrapRepositories.clientQueryRepository,
  ),
  findClientByIdQuery: new FindClientByIdQuery(
    bootstrapRepositories.clientQueryRepository,
  ),
  findPaginatedClientHardDrivesQuery: new FindPaginatedClientHardDrivesQuery(
    bootstrapRepositories.clientHardDriveQueryRepository,
  ),
  findPaginatedClientNetworkCardsQuery: new FindPaginatedClientNetworkCardsQuery(
    bootstrapRepositories.clientNetworkCardQueryRepository,
  ),
  findPaginatedClientInstalledSoftwareQuery: new FindPaginatedClientInstalledSoftwareQuery(
    bootstrapRepositories.clientInstalledSoftwareQueryRepository,
  ),

  // Jobs
  findPaginatedJobsQuery: new FindPaginatedJobsQuery(
    bootstrapRepositories.jobQueryRepository,
  ),

  // Tickets
  findPaginatedTicketsQuery: new FindPaginatedTicketsQuery(
    bootstrapRepositories.ticketQueryRepository,
  ),
  findTicketByIdQuery: new FindTicketByIdQuery(
    bootstrapRepositories.ticketQueryRepository,
  ),

  // Assets
  findPaginatedAssetsQuery: new FindPaginatedAssetsQuery(
    bootstrapRepositories.assetQueryRepository,
  ),
  findAssetByIdQuery: new FindAssetByIdQuery(
    bootstrapRepositories.assetQueryRepository,
  ),
  findAssetTypesQuery: new FindAssetTypesQuery(
    bootstrapRepositories.assetQueryRepository,
  ),

  // Client Commands
  findPaginatedClientCommandsQuery: new FindPaginatedClientCommandsQuery(
    bootstrapRepositories.clientCommandQueryRepository,
  ),
  findClientCommandByIdQuery: new FindClientCommandByIdQuery(
    bootstrapRepositories.clientCommandQueryRepository,
  ),
  pushClientCommandCommand: new PushClientCommandCommand(
    bootstrapRepositories.clientCommandWriteRepository,
  ),

  // Rollout Templates
  findPaginatedRolloutTemplatesQuery: new FindPaginatedRolloutTemplatesQuery(
    bootstrapRepositories.rolloutTemplateQueryRepository,
  ),
  findRolloutTemplateByIdQuery: new FindRolloutTemplateByIdQuery(
    bootstrapRepositories.rolloutTemplateQueryRepository,
  ),
  pushRolloutTemplateCommand: new PushRolloutTemplateCommand(
    bootstrapRepositories.rolloutTemplateWriteRepository,
  ),
};

export type UseCases = typeof bootstrapUseCases;
