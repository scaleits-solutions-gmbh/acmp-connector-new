import { FindAssetTypesIn } from './find-asset-types.in';
import { FindAssetTypesOut } from './find-asset-types.out';

export interface FindAssetTypesQueryPrimaryPort {
  execute(input: FindAssetTypesIn): Promise<FindAssetTypesOut>;
}
