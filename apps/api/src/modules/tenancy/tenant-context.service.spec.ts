import { TenantContextService } from "./tenant-context.service";

describe("TenantContextService", () => {
  it("keeps request scoped tenant data inside async local storage", () => {
    const service = new TenantContextService();

    service.run({ tenantId: "tenant_1", companyId: "company_1" }, () => {
      expect(service.getRequired()).toEqual({
        tenantId: "tenant_1",
        companyId: "company_1",
      });
    });
  });

  it("throws when tenant context is missing", () => {
    const service = new TenantContextService();

    expect(() => service.getRequired()).toThrow("Tenant context is not available");
  });
});
