import { FindAssetCountIn } from '@/application/ports/primary/assets/queries/find-asset-count/find-asset-count.in';
import { FindAssetCountOut } from '@/application/ports/primary/assets/queries/find-asset-count/find-asset-count.out';
import { FindAssetCountQueryPrimaryPort } from '@/application/ports/primary/assets/queries/find-asset-count/find-asset-count.query.port';
import { AssetQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/assets/asset.query-repository';
import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';

export class FindAssetCountQuery extends BaseApi<FindAssetCountIn, FindAssetCountOut> implements FindAssetCountQueryPrimaryPort {
  public constructor(private readonly assetQueryRepository: AssetQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindAssetCountIn): Promise<FindAssetCountOut> {
    const filters = input.filters ? {
      searchTerm: input.filters?.searchTerm,
      assetType: input.filters?.assetType,
    } : undefined;

    const count = await this.assetQueryRepository.findAssetCount(filters);

    return FindAssetCountOut.create({ count });
  }
}
