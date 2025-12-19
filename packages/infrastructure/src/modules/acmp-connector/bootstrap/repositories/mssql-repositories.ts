import { MssqlClientQueryRepository } from 'acmp-connector/repositories/mssql/clients/query/client.query-repository';
import { MssqlClientHardDriveQueryRepository } from 'acmp-connector/repositories/mssql/clients/query/client-hard-drive.query-repository';
import { MssqlClientNetworkCardQueryRepository } from 'acmp-connector/repositories/mssql/clients/query/client-network-card.query-repository';
import { MssqlClientInstalledSoftwareQueryRepository } from 'acmp-connector/repositories/mssql/clients/query/client-installed-software.query-repository';
import { MssqlJobQueryRepository } from 'acmp-connector/repositories/mssql/jobs/query/job.query-repository';
import { MssqlTicketQueryRepository } from 'acmp-connector/repositories/mssql/tickets/query/ticket.query-repository';
import { MssqlAssetQueryRepository } from 'acmp-connector/repositories/mssql/assets/query/asset.query-repository';
import { MssqlClientCommandQueryRepository } from 'acmp-connector/repositories/mssql/client-commands/query/client-command.query-repository';
import { MssqlRolloutTemplateQueryRepository } from 'acmp-connector/repositories/mssql/rollout-templates/query/rollout-template.query-repository';

export const bootstrapMssqlRepositories = {
  clientQueryRepository: new MssqlClientQueryRepository(),
  clientHardDriveQueryRepository: new MssqlClientHardDriveQueryRepository(),
  clientNetworkCardQueryRepository: new MssqlClientNetworkCardQueryRepository(),
  clientInstalledSoftwareQueryRepository: new MssqlClientInstalledSoftwareQueryRepository(),
  jobQueryRepository: new MssqlJobQueryRepository(),
  ticketQueryRepository: new MssqlTicketQueryRepository(),
  assetQueryRepository: new MssqlAssetQueryRepository(),
  clientCommandQueryRepository: new MssqlClientCommandQueryRepository(),
  rolloutTemplateQueryRepository: new MssqlRolloutTemplateQueryRepository(),
};
