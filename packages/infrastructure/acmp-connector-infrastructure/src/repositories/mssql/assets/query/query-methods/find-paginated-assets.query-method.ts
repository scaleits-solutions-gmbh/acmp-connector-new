import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpAssetListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedAssetsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { findAssetCountQueryMethod } from './find-asset-count.query-method';

export async function findPaginatedAssetsQueryMethod(pagination: PaginationOption, filters?: FindPaginatedAssetsFilters): Promise<PaginatedData<AcmpAssetListItemReadModel>> {
  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 10;

  const query = `
      ;WITH TypeTree AS (
        SELECT t.Id FROM [SYS_Assets_Types] t WHERE t.Id = @typeId
        UNION ALL SELECT c.Id FROM [SYS_Assets_Types] c JOIN TypeTree tt ON c.ParentId = tt.Id
      )
      SELECT sa.Id AS id, sa.Name AS assetName, sat.Name AS assetType, sml.Path AS location,
        scc.Path AS costCenter, smd.Name AS department, smcV.Name AS vendor, smcM.Name AS manufacturer,
        smcS.Name AS servicePartner, sas.Caption_en AS stateEn, sas.Caption_de AS stateDe,
        sa.InventoryNumber AS inventoryNumber, sa.SerialNumber AS serialNumber, sa.Model AS model,
        DATEADD(SECOND, (sa.CreationDate - FLOOR(sa.CreationDate)) * 86400, DATEADD(DAY, FLOOR(sa.CreationDate), '1899-12-30')) AS creationDate,
        DATEADD(SECOND, (sa.LastModifiedDate - FLOOR(sa.LastModifiedDate)) * 86400, DATEADD(DAY, FLOOR(sa.LastModifiedDate), '1899-12-30')) AS lastModifiedDate,
        sa.IsLent AS isLent
      FROM [SYS_Assets] sa
      LEFT JOIN SYS_Assets_Types sat ON sat.Id = sa.AssetTypeId
      LEFT JOIN SYS_MasterData_Locations sml ON sml.Id = sa.LocationId
      LEFT JOIN SYS_MasterData_CostCenters scc ON scc.Id = sa.CostCenterId
      LEFT JOIN SYS_MasterData_Departments smd ON smd.Id = sa.DepartmentId
      LEFT JOIN SYS_MasterData_Companies smcV ON smcV.Id = sa.VendorId
      LEFT JOIN SYS_MasterData_Companies smcM ON smcM.Id = sa.ManufacturerId
      LEFT JOIN SYS_MasterData_Companies smcS ON smcS.Id = sa.ServicePartnerId
      LEFT JOIN SYS_Assets_States sas ON sas.Id = sa.AssetStateId
      WHERE (@searchPattern IS NULL OR sa.Name LIKE @searchPattern) AND (@typeId IS NULL OR sa.AssetTypeId IN (SELECT Id FROM TypeTree))
      ORDER BY sa.Name ASC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `;
  const offset = (page - 1) * pageSize;
  const params = { searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : null, typeId: filters?.assetType || null, offset, pageSize };
  const rows = await MssqlUtils.query(query, params);
  const total = await findAssetCountQueryMethod(filters);
  const data = rows.map(r => ({ ...r, assetType: r.assetType ?? undefined, location: r.location ?? undefined, costCenter: r.costCenter ?? undefined, department: r.department ?? undefined, vendor: r.vendor ?? undefined, manufacturer: r.manufacturer ?? undefined, servicePartner: r.servicePartner ?? undefined, stateEn: r.stateEn ?? undefined, stateDe: r.stateDe ?? undefined, inventoryNumber: r.inventoryNumber ?? undefined, serialNumber: r.serialNumber ?? undefined, model: r.model ?? undefined }));
  const totalPages = Math.ceil(total / pageSize);
  return { data, total, page, pageSize, totalPages };
}
