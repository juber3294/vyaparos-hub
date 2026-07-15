export type AuthenticatedUser = {
  id: string;
  tenantId: string;
  companyId?: string | null;
  branchId?: string | null;
  warehouseId?: string | null;
  email?: string | null;
  phone?: string | null;
  roles: string[];
  permissions: string[];
};

export type JwtAccessPayload = {
  sub: string;
  tenantId: string;
  companyId?: string | null;
  branchId?: string | null;
  warehouseId?: string | null;
  roles: string[];
  permissions: string[];
};
