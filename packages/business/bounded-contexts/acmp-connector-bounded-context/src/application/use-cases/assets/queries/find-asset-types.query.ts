import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindAssetTypesIn } from '@/application/ports/primary/assets/queries/find-asset-types/find-asset-types.in';
import { FindAssetTypesOut } from '@/application/ports/primary/assets/queries/find-asset-types/find-asset-types.out';
import { FindAssetTypesQueryPrimaryPort } from '@/application/ports/primary/assets/queries/find-asset-types/find-asset-types.query.port';
import { AssetQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/assets/asset.query-repository';

export class FindAssetTypesQuery extends BaseApi<FindAssetTypesIn, FindAssetTypesOut> implements FindAssetTypesQueryPrimaryPort {
  public constructor(private readonly assetQueryRepository: AssetQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(_input: FindAssetTypesIn): Promise<FindAssetTypesOut> {
    const assetTypes = await this.assetQueryRepository.findAssetTypes();

    return FindAssetTypesOut.create(assetTypes);
  }
}
