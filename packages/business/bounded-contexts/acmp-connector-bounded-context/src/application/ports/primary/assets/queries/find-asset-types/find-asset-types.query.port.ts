import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { FindAssetTypesIn } from './find-asset-types.in';
import { FindAssetTypesOut } from './find-asset-types.out';

export interface FindAssetTypesQueryPrimaryPort extends BaseApiPort<FindAssetTypesIn, FindAssetTypesOut> {}
