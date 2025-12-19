import { MssqlUtils } from 'acmp-connector/config/mssql/client';

export async function findClientHardDriveCountQueryMethod(clientId: string): Promise<number> {
  const query = `SELECT COUNT(*) as count FROM CLT_HDW_HARDDRIVES WHERE CLIENTID = @clientId`;
  return (await MssqlUtils.scalar<number>(query, { clientId })) || 0;
}
