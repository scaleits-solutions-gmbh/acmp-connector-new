import { FindClientByIdIn } from '@/application/ports/primary/clients/queries/find-client-by-id/find-client-by-id.in';
import { FindClientByIdOut } from '@/application/ports/primary/clients/queries/find-client-by-id/find-client-by-id.out';
import { FindClientByIdQueryPrimaryPort } from '@/application/ports/primary/clients/queries/find-client-by-id/find-client-by-id.query.port';
import { ClientQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/clients/client.query-repository';

export class FindClientByIdQuery implements FindClientByIdQueryPrimaryPort {
  public constructor(private readonly clientQueryRepository: ClientQueryRepositorySecondaryPort) {}

  public async execute(input: FindClientByIdIn): Promise<FindClientByIdOut> {
    const client = await this.clientQueryRepository.findClientById(input.id);

    if (!client) {
      throw new Error('Client not found');
    }

    return FindClientByIdOut.create(client);
  }
}
