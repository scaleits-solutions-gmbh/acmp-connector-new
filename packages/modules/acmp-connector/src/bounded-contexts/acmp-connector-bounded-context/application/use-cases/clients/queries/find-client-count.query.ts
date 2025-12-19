import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindClientCountIn } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-client-count/find-client-count.in';
import { FindClientCountOut } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-client-count/find-client-count.out';
import { FindClientCountQueryPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-client-count/find-client-count.query.port';
import { ClientQueryRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/clients/client.query-repository';

export class FindClientCountQuery extends BaseApi<FindClientCountIn, FindClientCountOut> implements FindClientCountQueryPrimaryPort {
  public constructor(private readonly clientQueryRepository: ClientQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindClientCountIn): Promise<FindClientCountOut> {
    const filters = input.filters
      ? {
          searchTerm: input.filters?.searchTerm,
          tenantId: input.filters?.tenantId,
        }
      : undefined;

    const count = await this.clientQueryRepository.findClientCount(filters);

    return FindClientCountOut.create({ count });
  }
}
