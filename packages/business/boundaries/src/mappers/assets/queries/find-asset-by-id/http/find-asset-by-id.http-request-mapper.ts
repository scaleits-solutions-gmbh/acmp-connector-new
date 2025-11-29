import { FindAssetByIdIn } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetAssetByIdHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findAssetByIdHttpRequestMapper(request: GetAssetByIdHttpRequest): FindAssetByIdIn {
  return FindAssetByIdIn.create({
    id: request.pathParams.id,
  });
}
