import { FindClientNetworkCardCountIn } from '@/application/ports/primary/clients/queries/find-client-network-card-count/find-client-network-card-count.in';
import { FindClientNetworkCardCountOut } from '@/application/ports/primary/clients/queries/find-client-network-card-count/find-client-network-card-count.out';
import { FindClientNetworkCardCountQueryPrimaryPort } from '@/application/ports/primary/clients/queries/find-client-network-card-count/find-client-network-card-count.query.port';
import { ClientNetworkCardQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/clients/client-network-card.query-repository';

export class FindClientNetworkCardCountQuery implements FindClientNetworkCardCountQueryPrimaryPort {
  public constructor(private readonly clientNetworkCardQueryRepository: ClientNetworkCardQueryRepositorySecondaryPort) {}

  public async execute(input: FindClientNetworkCardCountIn): Promise<FindClientNetworkCardCountOut> {
    const count = await this.clientNetworkCardQueryRepository.findClientNetworkCardCount(input.clientId);

    return FindClientNetworkCardCountOut.create({ count });
  }
}
