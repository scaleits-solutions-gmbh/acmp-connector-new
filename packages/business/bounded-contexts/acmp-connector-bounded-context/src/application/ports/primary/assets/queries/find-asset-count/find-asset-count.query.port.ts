import { FindAssetCountIn } from './find-asset-count.in';
import { FindAssetCountOut } from './find-asset-count.out';

export interface FindAssetCountQueryPrimaryPort {
  execute(input: FindAssetCountIn): Promise<FindAssetCountOut>;
}
