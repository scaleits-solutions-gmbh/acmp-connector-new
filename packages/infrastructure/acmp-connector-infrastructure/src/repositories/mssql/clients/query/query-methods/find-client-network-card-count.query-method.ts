import { MssqlUtils } from '@/infra/mssql/client';

export async function findClientNetworkCardCountQueryMethod(clientId: string): Promise<number> {
  const query = `SELECT COUNT(*) as count FROM CLT_HDW_NETCARDS WHERE CLIENTID = @clientId`;
  return (await MssqlUtils.scalar<number>(query, { clientId })) || 0;
}
