import { FindPaginatedAssetsIn } from '@/application/ports/primary/assets/queries/find-paginated-assets/find-paginated-assets.in';
import { FindPaginatedAssetsOut } from '@/application/ports/primary/assets/queries/find-paginated-assets/find-paginated-assets.out';
import { FindPaginatedAssetsQueryPrimaryPort } from '@/application/ports/primary/assets/queries/find-paginated-assets/find-paginated-assets.query.port';
import { AssetQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/assets/asset.query-repository';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export class FindPaginatedAssetsQuery implements FindPaginatedAssetsQueryPrimaryPort {
  public constructor(private readonly assetQueryRepository: AssetQueryRepositorySecondaryPort) {}

  public async execute(input: FindPaginatedAssetsIn): Promise<FindPaginatedAssetsOut> {
    const paginationOption: PaginationOption = {
      page: input.paginationOptions.page,
      pageSize: input.paginationOptions.pageSize,
    };

    const filters = input.filters ? {
      searchTerm: input.filters?.searchTerm,
      assetType: input.filters?.assetType,
    } : undefined;

    const paginatedData = await this.assetQueryRepository.findPaginatedAssets(paginationOption, filters);

    return FindPaginatedAssetsOut.create(paginatedData);
  }
}
