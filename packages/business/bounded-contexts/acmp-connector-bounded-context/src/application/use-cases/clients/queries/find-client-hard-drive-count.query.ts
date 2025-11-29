import { FindClientHardDriveCountIn } from '@/application/ports/primary/clients/queries/find-client-hard-drive-count/find-client-hard-drive-count.in';
import { FindClientHardDriveCountOut } from '@/application/ports/primary/clients/queries/find-client-hard-drive-count/find-client-hard-drive-count.out';
import { FindClientHardDriveCountQueryPrimaryPort } from '@/application/ports/primary/clients/queries/find-client-hard-drive-count/find-client-hard-drive-count.query.port';
import { ClientHardDriveQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/clients/client-hard-drive.query-repository';

export class FindClientHardDriveCountQuery implements FindClientHardDriveCountQueryPrimaryPort {
  public constructor(private readonly clientHardDriveQueryRepository: ClientHardDriveQueryRepositorySecondaryPort) {}

  public async execute(input: FindClientHardDriveCountIn): Promise<FindClientHardDriveCountOut> {
    const count = await this.clientHardDriveQueryRepository.findClientHardDriveCount(input.clientId);

    return FindClientHardDriveCountOut.create({ count });
  }
}
