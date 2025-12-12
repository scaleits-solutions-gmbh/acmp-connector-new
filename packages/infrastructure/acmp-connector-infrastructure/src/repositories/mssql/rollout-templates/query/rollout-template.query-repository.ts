import { RolloutTemplateQueryRepositorySecondaryPort, FindPaginatedRolloutTemplatesFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpRolloutTemplateListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

import { findPaginatedRolloutTemplatesQueryMethod } from './query-methods/find-paginated-rollout-templates.query-method';
import { findRolloutTemplateByIdQueryMethod } from './query-methods/find-rollout-template-by-id.query-method';
import { findRolloutTemplateCountQueryMethod } from './query-methods/find-rollout-template-count.query-method';
import { BaseSpi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';

export class MssqlRolloutTemplateQueryRepository extends BaseSpi implements RolloutTemplateQueryRepositorySecondaryPort {
  public constructor() {
    super();
  }
  /**
   * Find paginated list of rollout templates
   */
  async findPaginatedRolloutTemplates(
    pagination: PaginationOption,
    filters?: FindPaginatedRolloutTemplatesFilters,
  ): Promise<PaginatedData<AcmpRolloutTemplateListItemReadModel>> {
    const data = await findPaginatedRolloutTemplatesQueryMethod(pagination, filters);
    return data;
  }

  /**
   * Find rollout template by ID
   */
  async findRolloutTemplateById(id: string): Promise<AcmpRolloutTemplateListItemReadModel | null> {
    const template = await findRolloutTemplateByIdQueryMethod(id);
    return template;
  }

  /**
   * Count rollout templates with optional filters
   */
  async findRolloutTemplateCount(filters?: FindPaginatedRolloutTemplatesFilters): Promise<number> {
    const count = await findRolloutTemplateCountQueryMethod(filters);
    return count;
  }
}
