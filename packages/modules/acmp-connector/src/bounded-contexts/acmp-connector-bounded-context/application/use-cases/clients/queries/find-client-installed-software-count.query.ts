import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindClientInstalledSoftwareCountIn } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-client-installed-software-count/find-client-installed-software-count.in';
import { FindClientInstalledSoftwareCountOut } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-client-installed-software-count/find-client-installed-software-count.out';
import { FindClientInstalledSoftwareCountQueryPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-client-installed-software-count/find-client-installed-software-count.query.port';
import { ClientInstalledSoftwareQueryRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/clients/client-installed-software.query-repository';

export class FindClientInstalledSoftwareCountQuery
  extends BaseApi<FindClientInstalledSoftwareCountIn, FindClientInstalledSoftwareCountOut>
  implements FindClientInstalledSoftwareCountQueryPrimaryPort
{
  public constructor(private readonly clientInstalledSoftwareQueryRepository: ClientInstalledSoftwareQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindClientInstalledSoftwareCountIn): Promise<FindClientInstalledSoftwareCountOut> {
    const filters = input.filters ? { searchTerm: input.filters?.searchTerm } : undefined;

    const count = await this.clientInstalledSoftwareQueryRepository.findClientInstalledSoftwareCount(input.clientId, filters);

    return FindClientInstalledSoftwareCountOut.create({ count });
  }
}
