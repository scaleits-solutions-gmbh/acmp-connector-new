import { AcmpTicketDetailsReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';

export async function findTicketDetailsByIdQueryMethod(id: string): Promise<AcmpTicketDetailsReadModel | null> {
  const query = `
      SELECT TOP 1 sht.TicketID AS ticketId, sht.IntTicketID AS intTicketId, sht.Caption AS caption,
        DATEADD(SECOND, (sht.CreationDate - FLOOR(sht.CreationDate)) * 86400, DATEADD(DAY, FLOOR(sht.CreationDate), '1899-12-30')) AS creationDate,
        DATEADD(SECOND, (sht.LastModified - FLOOR(sht.LastModified)) * 86400, DATEADD(DAY, FLOOR(sht.LastModified), '1899-12-30')) AS lastModified,
        sht.[Description] AS description, sht.HtmlDescription AS htmlDescription,
        shc.CategoryPath_en AS categoryEn, shc.CategoryPath_de AS categoryDe, sht.Priority AS priority,
        sts.Caption_en AS stateEn, sts.Caption_de AS stateDe, sht.Keywords AS keywords,
        shr.FullName AS ticketContact, su.USERNAME AS assignee, shi.Caption_en AS impactEn, shi.Caption_de AS impactDe
      FROM dbo.SYS_HD_Tickets AS sht
      LEFT JOIN dbo.SYS_HD_Categories AS shc ON shc.CategoryID = sht.CategoryID
      LEFT JOIN dbo.SYS_HD_Tickets_States AS sts ON sts.StateID = sht.StateID
      LEFT JOIN dbo.SYS_HD_Requester AS shr ON shr.RequesterID = sht.RequesterID
      LEFT JOIN dbo.SYS_USERS AS su ON su.USER_GUID = sht.AssigneeID
      LEFT JOIN dbo.SYS_HD_Impact AS shi ON shi.ImpactID = sht.ImpactID
      WHERE sht.TicketID = @id
    `;
  const rows = await MssqlUtils.query(query, { id });
  const r = rows[0];
  if (!r) return null;
  return { ...r, description: r.description ?? undefined, htmlDescription: r.htmlDescription ?? undefined, categoryEn: r.categoryEn ?? undefined, categoryDe: r.categoryDe ?? undefined, stateEn: r.stateEn ?? undefined, stateDe: r.stateDe ?? undefined, keywords: r.keywords ?? undefined, ticketContact: r.ticketContact ?? undefined, assignee: r.assignee ?? undefined, impactEn: r.impactEn ?? undefined, impactDe: r.impactDe ?? undefined };
}
