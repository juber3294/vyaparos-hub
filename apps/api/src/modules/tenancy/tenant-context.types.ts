export type TenantContext = {
  tenantId: string;
  companyId?: string;
  branchId?: string;
  warehouseId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
};
