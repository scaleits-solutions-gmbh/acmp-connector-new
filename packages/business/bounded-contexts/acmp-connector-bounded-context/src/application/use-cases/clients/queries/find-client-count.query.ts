import { FindClientCountIn } from '@/application/ports/primary/clients/queries/find-client-count/find-client-count.in';
import { FindClientCountOut } from '@/application/ports/primary/clients/queries/find-client-count/find-client-count.out';
import { FindClientCountQueryPrimaryPort } from '@/application/ports/primary/clients/queries/find-client-count/find-client-count.query.port';
import { ClientQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/clients/client.query-repository';

export class FindClientCountQuery implements FindClientCountQueryPrimaryPort {
  public constructor(private readonly clientQueryRepository: ClientQueryRepositorySecondaryPort) {}

  public async execute(input: FindClientCountIn): Promise<FindClientCountOut> {
    const filters = input.filters ? {
      searchTerm: input.filters?.searchTerm,
      tenantId: input.filters?.tenantId,
    } : undefined;

    const count = await this.clientQueryRepository.findClientCount(filters);

    return FindClientCountOut.create({ count });
  }
}
