import { AcmpClientCommandReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from 'acmp-connector/config/mssql/client';

export async function findClientCommandByIdQueryMethod(id: string): Promise<AcmpClientCommandReadModel | null> {
  const query = `
      SELECT TOP 1 ScriptID AS id, Description AS name, ScriptVersion AS version
      FROM SYS_SCRIPTS WHERE ScriptID = @id ORDER BY ScriptVersion DESC
    `;
  const rows = await MssqlUtils.query(query, { id });
  return rows[0] || null;
}
