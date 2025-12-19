import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindClientHardDriveCountIn } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-client-hard-drive-count/find-client-hard-drive-count.in';
import { FindClientHardDriveCountOut } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-client-hard-drive-count/find-client-hard-drive-count.out';
import { FindClientHardDriveCountQueryPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-client-hard-drive-count/find-client-hard-drive-count.query.port';
import { ClientHardDriveQueryRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/clients/client-hard-drive.query-repository';

export class FindClientHardDriveCountQuery extends BaseApi<FindClientHardDriveCountIn, FindClientHardDriveCountOut> implements FindClientHardDriveCountQueryPrimaryPort {
  public constructor(private readonly clientHardDriveQueryRepository: ClientHardDriveQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindClientHardDriveCountIn): Promise<FindClientHardDriveCountOut> {
    const count = await this.clientHardDriveQueryRepository.findClientHardDriveCount(input.clientId);

    return FindClientHardDriveCountOut.create({ count });
  }
}
