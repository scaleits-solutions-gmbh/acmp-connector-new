import { FindAssetTypesIn } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetAssetTypesHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findAssetTypesHttpRequestMapper(request: GetAssetTypesHttpRequest): FindAssetTypesIn {
  return FindAssetTypesIn.create({});
}
