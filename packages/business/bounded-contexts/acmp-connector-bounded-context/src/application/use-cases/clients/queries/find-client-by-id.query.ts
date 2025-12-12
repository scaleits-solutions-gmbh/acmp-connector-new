import { BaseApi, NotFoundError } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindClientByIdIn } from '@/application/ports/primary/clients/queries/find-client-by-id/find-client-by-id.in';
import { FindClientByIdOut } from '@/application/ports/primary/clients/queries/find-client-by-id/find-client-by-id.out';
import { FindClientByIdQueryPrimaryPort } from '@/application/ports/primary/clients/queries/find-client-by-id/find-client-by-id.query.port';
import { ClientQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/clients/client.query-repository';

export class FindClientByIdQuery extends BaseApi<FindClientByIdIn, FindClientByIdOut> implements FindClientByIdQueryPrimaryPort {
  public constructor(private readonly clientQueryRepository: ClientQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindClientByIdIn): Promise<FindClientByIdOut> {
    const client = await this.clientQueryRepository.findClientById(input.id);

    if (!client) {
      throw new NotFoundError({ message: 'Client not found' });
    }

    return FindClientByIdOut.create(client);
  }
}
