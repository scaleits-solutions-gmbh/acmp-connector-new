import { FindAssetByIdOut } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetAssetByIdHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findAssetByIdHttpResponseMapper(response: FindAssetByIdOut): GetAssetByIdHttpResponse {
  return {
    statusCode: 200,
    body: response.asset,
  };
}
