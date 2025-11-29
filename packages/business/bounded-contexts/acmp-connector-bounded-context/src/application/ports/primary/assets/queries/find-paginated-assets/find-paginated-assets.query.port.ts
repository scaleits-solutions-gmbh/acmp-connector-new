import { FindPaginatedAssetsIn } from './find-paginated-assets.in';
import { FindPaginatedAssetsOut } from './find-paginated-assets.out';

export interface FindPaginatedAssetsQueryPrimaryPort {
  execute(input: FindPaginatedAssetsIn): Promise<FindPaginatedAssetsOut>;
}
