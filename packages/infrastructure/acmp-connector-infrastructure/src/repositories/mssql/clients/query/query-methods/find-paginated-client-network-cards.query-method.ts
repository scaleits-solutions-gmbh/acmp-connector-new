import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientNetworkCardListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { findClientNetworkCardCountQueryMethod } from './find-client-network-card-count.query-method';

export async function findPaginatedClientNetworkCardsQueryMethod(clientId: string, pagination: PaginationOption): Promise<PaginatedData<AcmpClientNetworkCardListItemReadModel>> {
  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 10;

  const query = `
      SELECT Name AS name, IPs AS ipAddress, Mac AS macAddress, DNSServerIP AS dns, Gateways AS gateway,
        Netmasks AS subnetMask, CASE WHEN UseDHCP = 1 THEN 'DHCP' ELSE 'Static' END AS addressType
      FROM CLT_HDW_NETCARDS WHERE CLIENTID = @clientId
      ORDER BY Name ASC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `;
  const offset = (page - 1) * pageSize;
  const rows = await MssqlUtils.query(query, { clientId, offset, pageSize });
  const total = await findClientNetworkCardCountQueryMethod(clientId);
  const data = rows.map((r, i) => ({ 
    id: `${clientId}:${r.name}:${i}`, 
    ...r,
    ipAddress: r.ipAddress ?? '',
    macAddress: r.macAddress ?? '',
    dns: r.dns ?? '',
    gateway: r.gateway ?? '',
    subnetMask: r.subnetMask ?? '',
  }));
  const totalPages = Math.ceil(total / pageSize);
  return { data, total, page, pageSize, totalPages };
}
