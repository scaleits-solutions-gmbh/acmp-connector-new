import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { FindAssetCountIn } from './find-asset-count.in';
import { FindAssetCountOut } from './find-asset-count.out';

export interface FindAssetCountQueryPrimaryPort extends BaseApiPort<FindAssetCountIn, FindAssetCountOut> {}
