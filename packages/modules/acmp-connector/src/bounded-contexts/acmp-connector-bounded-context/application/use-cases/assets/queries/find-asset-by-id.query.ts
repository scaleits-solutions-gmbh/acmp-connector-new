import { BaseApi, NotFoundError } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindAssetByIdIn } from 'acmp-connector-bounded-context/application/ports/primary/assets/queries/find-asset-by-id/find-asset-by-id.in';
import { FindAssetByIdOut } from 'acmp-connector-bounded-context/application/ports/primary/assets/queries/find-asset-by-id/find-asset-by-id.out';
import { FindAssetByIdQueryPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/assets/queries/find-asset-by-id/find-asset-by-id.query.port';
import { AssetQueryRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/assets/asset.query-repository';

export class FindAssetByIdQuery extends BaseApi<FindAssetByIdIn, FindAssetByIdOut> implements FindAssetByIdQueryPrimaryPort {
  public constructor(private readonly assetQueryRepository: AssetQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindAssetByIdIn): Promise<FindAssetByIdOut> {
    const asset = await this.assetQueryRepository.findAssetById(input.id);

    if (!asset) {
      throw new NotFoundError({ message: 'Asset not found' });
    }

    return FindAssetByIdOut.create(asset);
  }
}
