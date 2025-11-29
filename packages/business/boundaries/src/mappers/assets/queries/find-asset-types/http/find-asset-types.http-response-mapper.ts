import { FindAssetTypesOut } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetAssetTypesHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findAssetTypesHttpResponseMapper(response: FindAssetTypesOut): GetAssetTypesHttpResponse {
  return {
    statusCode: 200,
    body: response.assetTypes,
  };
}
