import { FindAssetTypesIn } from './find-asset-types.in';
import { FindAssetTypesOut } from './find-asset-types.out';
import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export interface FindAssetTypesQueryPrimaryPort extends BaseApiPort<FindAssetTypesIn, FindAssetTypesOut> {}
