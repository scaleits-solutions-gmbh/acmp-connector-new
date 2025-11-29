import { FindAssetByIdIn } from './find-asset-by-id.in';
import { FindAssetByIdOut } from './find-asset-by-id.out';

export interface FindAssetByIdQueryPrimaryPort {
  execute(input: FindAssetByIdIn): Promise<FindAssetByIdOut>;
}
