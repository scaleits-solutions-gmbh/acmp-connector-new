import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpTicketListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from 'acmp-connector/config/mssql/client';
import { FindPaginatedTicketsFilters } from '@repo/modules/acmp-connector';
import { findTicketCountQueryMethod } from './find-ticket-count.query-method';

export async function findPaginatedTicketsQueryMethod(pagination: PaginationOption, filters?: FindPaginatedTicketsFilters): Promise<PaginatedData<AcmpTicketListItemReadModel>> {
  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 10;

  const query = `
      SELECT sht.TicketID AS id, sht.IntTicketID AS intId, sht.Caption AS caption,
        DATEADD(SECOND, (sht.CreationDate - FLOOR(sht.CreationDate)) * 86400, DATEADD(DAY, FLOOR(sht.CreationDate), '1899-12-30')) AS creationDate,
        DATEADD(SECOND, (sht.LastModified - FLOOR(sht.LastModified)) * 86400, DATEADD(DAY, FLOOR(sht.LastModified), '1899-12-30')) AS lastModified,
        shc.CategoryPath_en AS categoryEn, shc.CategoryPath_de AS categoryDe, sht.Priority AS priority,
        sts.Caption_en AS stateEn, sts.Caption_de AS stateDe, shr.FullName AS ticketContact,
        su.USERNAME AS assignee, shi.Caption_en AS impactEn, shi.Caption_de AS impactDe
      FROM dbo.SYS_HD_Tickets AS sht
      LEFT JOIN dbo.SYS_HD_Categories AS shc ON shc.CategoryID = sht.CategoryID
      LEFT JOIN dbo.SYS_HD_Tickets_States AS sts ON sts.StateID = sht.StateID
      LEFT JOIN dbo.SYS_HD_Requester AS shr ON shr.RequesterID = sht.RequesterID
      LEFT JOIN dbo.SYS_USERS AS su ON su.USER_GUID = sht.AssigneeID
      LEFT JOIN dbo.SYS_HD_Impact AS shi ON shi.ImpactID = sht.ImpactID
      WHERE (@searchPattern IS NULL OR sht.Caption LIKE @searchPattern)
      ORDER BY sht.TicketID DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `;
  const offset = (page - 1) * pageSize;
  const params = { searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : null, offset, pageSize };
  const rows = await MssqlUtils.query(query, params);
  const total = await findTicketCountQueryMethod(filters);
  const data = rows.map((r) => ({
    ...r,
    categoryEn: r.categoryEn ?? undefined,
    categoryDe: r.categoryDe ?? undefined,
    stateEn: r.stateEn ?? undefined,
    stateDe: r.stateDe ?? undefined,
    ticketContact: r.ticketContact ?? undefined,
    assignee: r.assignee ?? undefined,
    impactEn: r.impactEn ?? undefined,
    impactDe: r.impactDe ?? undefined,
  }));
  const totalPages = Math.ceil(total / pageSize);
  return { data, total, page, pageSize, totalPages };
}
