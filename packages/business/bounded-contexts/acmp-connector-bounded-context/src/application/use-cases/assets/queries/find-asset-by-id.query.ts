import { FindAssetByIdIn } from '@/application/ports/primary/assets/queries/find-asset-by-id/find-asset-by-id.in';
import { FindAssetByIdOut } from '@/application/ports/primary/assets/queries/find-asset-by-id/find-asset-by-id.out';
import { FindAssetByIdQueryPrimaryPort } from '@/application/ports/primary/assets/queries/find-asset-by-id/find-asset-by-id.query.port';
import { AssetQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/assets/asset.query-repository';

export class FindAssetByIdQuery implements FindAssetByIdQueryPrimaryPort {
  public constructor(private readonly assetQueryRepository: AssetQueryRepositorySecondaryPort) {}

  public async execute(input: FindAssetByIdIn): Promise<FindAssetByIdOut> {
    const asset = await this.assetQueryRepository.findAssetById(input.id);

    if (!asset) {
      throw new Error('Asset not found');
    }

    return FindAssetByIdOut.create(asset);
  }
}
