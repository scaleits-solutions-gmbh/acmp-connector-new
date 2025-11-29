import { FindPaginatedRolloutTemplatesIn } from '@/application/ports/primary/rollout-templates/queries/find-paginated-rollout-templates/find-paginated-rollout-templates.in';
import { FindPaginatedRolloutTemplatesOut } from '@/application/ports/primary/rollout-templates/queries/find-paginated-rollout-templates/find-paginated-rollout-templates.out';
import { FindPaginatedRolloutTemplatesQueryPrimaryPort } from '@/application/ports/primary/rollout-templates/queries/find-paginated-rollout-templates/find-paginated-rollout-templates.query.port';
import { RolloutTemplateQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/rollout-templates/rollout-template.query-repository';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export class FindPaginatedRolloutTemplatesQuery implements FindPaginatedRolloutTemplatesQueryPrimaryPort {
  public constructor(private readonly rolloutTemplateQueryRepository: RolloutTemplateQueryRepositorySecondaryPort) {}

  public async execute(input: FindPaginatedRolloutTemplatesIn): Promise<FindPaginatedRolloutTemplatesOut> {
    const paginationOption: PaginationOption = {
      page: input.paginationOptions.page,
      pageSize: input.paginationOptions.pageSize,
    };

    const filters = input.filters ? {
      searchTerm: input.filters?.searchTerm,
      os: input.filters?.os,
    } : undefined;

    const paginatedData = await this.rolloutTemplateQueryRepository.findPaginatedRolloutTemplates(paginationOption, filters);

    return FindPaginatedRolloutTemplatesOut.create(paginatedData);
  }
}
