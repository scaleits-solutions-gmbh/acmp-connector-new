import { FindAssetByIdIn } from './find-asset-by-id.in';
import { FindAssetByIdOut } from './find-asset-by-id.out';
import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export interface FindAssetByIdQueryPrimaryPort extends BaseApiPort<FindAssetByIdIn, FindAssetByIdOut> {}