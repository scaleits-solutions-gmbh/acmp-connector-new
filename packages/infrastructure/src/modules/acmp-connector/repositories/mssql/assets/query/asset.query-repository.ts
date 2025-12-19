import { MssqlUtils } from 'acmp-connector/config/mssql/client';
import { AssetQueryRepositorySecondaryPort, FindPaginatedAssetsFilters } from '@repo/modules/acmp-connector';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpAssetListItemReadModel, AcmpAssetTypeListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

import { findPaginatedAssetsQueryMethod } from './query-methods/find-paginated-assets.query-method';
import { findAssetByIdQueryMethod } from './query-methods/find-asset-by-id.query-method';
import { findAssetCountQueryMethod } from './query-methods/find-asset-count.query-method';
import { findAssetTypesQueryMethod } from './query-methods/find-asset-types.query-method';
import { BaseSpi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';

export class MssqlAssetQueryRepository extends BaseSpi implements AssetQueryRepositorySecondaryPort {
  public constructor() {
    super();
  }
  /**
   * Find paginated list of assets
   */
  async findPaginatedAssets(pagination: PaginationOption, filters?: FindPaginatedAssetsFilters): Promise<PaginatedData<AcmpAssetListItemReadModel>> {
    const data = await findPaginatedAssetsQueryMethod(pagination, filters);
    return data;
  }

  /**
   * Find asset by ID
   */
  async findAssetById(id: string): Promise<AcmpAssetListItemReadModel | null> {
    const asset = await findAssetByIdQueryMethod(id);
    return asset;
  }

  /**
   * Count assets with optional filters
   */
  async findAssetCount(filters?: FindPaginatedAssetsFilters): Promise<number> {
    const count = await findAssetCountQueryMethod(filters);
    return count;
  }

  /**
   * Find all asset types
   */
  async findAssetTypes(): Promise<AcmpAssetTypeListItemReadModel[]> {
    const types = await findAssetTypesQueryMethod();
    return types;
  }
}
