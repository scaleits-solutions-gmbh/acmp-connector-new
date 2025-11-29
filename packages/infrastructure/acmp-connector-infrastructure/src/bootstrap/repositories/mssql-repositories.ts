import { MssqlClientQueryRepository } from '@/repositories/mssql/clients/query/client.query-repository';
import { MssqlClientHardDriveQueryRepository } from '@/repositories/mssql/clients/query/client-hard-drive.query-repository';
import { MssqlClientNetworkCardQueryRepository } from '@/repositories/mssql/clients/query/client-network-card.query-repository';
import { MssqlClientInstalledSoftwareQueryRepository } from '@/repositories/mssql/clients/query/client-installed-software.query-repository';
import { MssqlJobQueryRepository } from '@/repositories/mssql/jobs/query/job.query-repository';
import { MssqlTicketQueryRepository } from '@/repositories/mssql/tickets/query/ticket.query-repository';
import { MssqlAssetQueryRepository } from '@/repositories/mssql/assets/query/asset.query-repository';
import { MssqlClientCommandQueryRepository } from '@/repositories/mssql/client-commands/query/client-command.query-repository';
import { MssqlRolloutTemplateQueryRepository } from '@/repositories/mssql/rollout-templates/query/rollout-template.query-repository';

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
