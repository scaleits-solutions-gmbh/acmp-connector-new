import { AcmpRolloutTemplateListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';

export type FindPaginatedRolloutTemplatesFilters = {
  searchTerm?: string;
  os?: string;
};

/**
 * Query repository for reading rollout template data from ACMP MSSQL database.
 */
export interface RolloutTemplateQueryRepositorySecondaryPort {
  /**
   * Find paginated list of rollout templates
   */
  findPaginatedRolloutTemplates(pagination: PaginationOption, filters?: FindPaginatedRolloutTemplatesFilters): Promise<PaginatedData<AcmpRolloutTemplateListItemReadModel>>;

  /**
   * Find rollout template by ID
   */
  findRolloutTemplateById(id: string): Promise<AcmpRolloutTemplateListItemReadModel | null>;

  /**
   * Count rollout templates with optional filters
   */
  findRolloutTemplateCount(filters?: FindPaginatedRolloutTemplatesFilters): Promise<number>;
}
