import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindAssetCountIn } from 'acmp-connector-bounded-context/application/ports/primary/assets/queries/find-asset-count/find-asset-count.in';
import { FindAssetCountOut } from 'acmp-connector-bounded-context/application/ports/primary/assets/queries/find-asset-count/find-asset-count.out';
import { FindAssetCountQueryPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/assets/queries/find-asset-count/find-asset-count.query.port';
import { AssetQueryRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/assets/asset.query-repository';

export class FindAssetCountQuery extends BaseApi<FindAssetCountIn, FindAssetCountOut> implements FindAssetCountQueryPrimaryPort {
  public constructor(private readonly assetQueryRepository: AssetQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindAssetCountIn): Promise<FindAssetCountOut> {
    const filters = input.filters
      ? {
          searchTerm: input.filters?.searchTerm,
          assetType: input.filters?.assetType,
        }
      : undefined;

    const count = await this.assetQueryRepository.findAssetCount(filters);

    return FindAssetCountOut.create({ count });
  }
}
