import { AcmpAssetListItemReadModel, AcmpAssetTypeListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';

export type FindPaginatedAssetsFilters = {
  searchTerm?: string;
  assetType?: string;
};

/**
 * Query repository for reading asset data from ACMP MSSQL database.
 */
export interface AssetQueryRepositorySecondaryPort {
  /**
   * Find paginated list of assets
   */
  findPaginatedAssets(pagination: PaginationOption, filters?: FindPaginatedAssetsFilters): Promise<PaginatedData<AcmpAssetListItemReadModel>>;

  /**
   * Find asset by ID
   */
  findAssetById(id: string): Promise<AcmpAssetListItemReadModel | null>;

  /**
   * Count assets with optional filters
   */
  findAssetCount(filters?: FindPaginatedAssetsFilters): Promise<number>;

  /**
   * Find all asset types
   */
  findAssetTypes(): Promise<AcmpAssetTypeListItemReadModel[]>;
}
