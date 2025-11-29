import { AcmpRolloutTemplateListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';

export async function findRolloutTemplateByIdQueryMethod(id: string): Promise<AcmpRolloutTemplateListItemReadModel | null> {
  const query = `SELECT TOP 1 TemplateId AS id, Name AS name, OSEdition AS os FROM SYS_OSD_RolloutTemplates WHERE TemplateId = @id`;
  const rows = await MssqlUtils.query(query, { id });
  return rows[0] || null;
}
