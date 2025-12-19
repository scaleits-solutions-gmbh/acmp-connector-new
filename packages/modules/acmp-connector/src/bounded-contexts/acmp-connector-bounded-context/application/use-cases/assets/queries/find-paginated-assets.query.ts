import { BaseApi, PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindPaginatedAssetsIn } from 'acmp-connector-bounded-context/application/ports/primary/assets/queries/find-paginated-assets/find-paginated-assets.in';
import { FindPaginatedAssetsOut } from 'acmp-connector-bounded-context/application/ports/primary/assets/queries/find-paginated-assets/find-paginated-assets.out';
import { FindPaginatedAssetsQueryPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/assets/queries/find-paginated-assets/find-paginated-assets.query.port';
import { AssetQueryRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/assets/asset.query-repository';

export class FindPaginatedAssetsQuery extends BaseApi<FindPaginatedAssetsIn, FindPaginatedAssetsOut> implements FindPaginatedAssetsQueryPrimaryPort {
  public constructor(private readonly assetQueryRepository: AssetQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindPaginatedAssetsIn): Promise<FindPaginatedAssetsOut> {
    const paginationOption: PaginationOption = {
      page: input.paginationOptions.page,
      pageSize: input.paginationOptions.pageSize,
    };

    const filters = input.filters
      ? {
          searchTerm: input.filters?.searchTerm,
          assetType: input.filters?.assetType,
        }
      : undefined;

    const paginatedData = await this.assetQueryRepository.findPaginatedAssets(paginationOption, filters);

    return FindPaginatedAssetsOut.create(paginatedData);
  }
}
