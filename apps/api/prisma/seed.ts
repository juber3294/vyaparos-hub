import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

const defaultRoles = [
  "SUPER_ADMIN",
  "COMPANY_OWNER",
  "ADMIN",
  "MANAGER",
  "SALES",
  "PURCHASE",
  "WAREHOUSE",
  "ACCOUNTANT",
  "CASHIER",
  "EMPLOYEE",
  "SUPPORT",
];

const modules = [
  "users",
  "roles",
  "customers",
  "suppliers",
  "products",
  "inventory",
  "purchases",
  "sales",
  "invoices",
  "payments",
  "reports",
  "settings",
];

const actions = ["create", "read", "update", "delete", "export"];

async function main() {
  const plan = await prisma.subscriptionPlan.upsert({
    where: { code: "PRO" },
    update: {},
    create: {
      code: "PRO",
      name: "VyaparOS Pro",
      monthlyPrice: 4999,
      yearlyPrice: 49990,
      maxCompanies: 5,
      maxBranches: 50,
      maxWarehouses: 100,
      maxUsers: 500,
      features: {
        ai: true,
        multiStore: true,
        gstReports: true,
        whatsapp: true,
      },
    },
  });

  const tenant = await prisma.tenant.upsert({
    where: { slug: "sharma-traders" },
    update: {},
    create: {
      id: "tenant_demo",
      name: "Sharma Traders",
      slug: "sharma-traders",
      status: "ACTIVE",
    },
  });

  await prisma.subscription.upsert({
    where: { id: "sub_demo" },
    update: {},
    create: {
      id: "sub_demo",
      tenantId: tenant.id,
      planId: plan.id,
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  const company = await prisma.company.upsert({
    where: { tenantId_gstin: { tenantId: tenant.id, gstin: "27AAECS1234F1Z5" } },
    update: {},
    create: {
      tenantId: tenant.id,
      legalName: "Sharma Traders Private Limited",
      tradeName: "Sharma Traders",
      gstin: "27AAECS1234F1Z5",
      pan: "AAECS1234F",
      phone: "+919820012345",
      email: "owner@sharmatraders.in",
      addressLine1: "142, Andheri Kurla Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400059",
      isDefault: true,
    },
  });

  const branch = await prisma.branch.upsert({
    where: {
      tenantId_companyId_code: { tenantId: tenant.id, companyId: company.id, code: "MUM-HO" },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      companyId: company.id,
      code: "MUM-HO",
      name: "Mumbai Head Office",
      address: "142, Andheri Kurla Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400059",
      isDefault: true,
    },
  });

  await prisma.warehouse.upsert({
    where: {
      tenantId_companyId_branchId_code: {
        tenantId: tenant.id,
        companyId: company.id,
        branchId: branch.id,
        code: "MAIN-WH",
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      companyId: company.id,
      branchId: branch.id,
      code: "MAIN-WH",
      name: "Main Warehouse",
      address: "Plot 22, MIDC",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400093",
      isDefault: true,
    },
  });

  const permissions = [];
  for (const module of modules) {
    for (const action of actions) {
      permissions.push(
        await prisma.permission.upsert({
          where: {
            module_action_resource: {
              module,
              action,
              resource: module.slice(0, -1) || module,
            },
          },
          update: {},
          create: {
            module,
            action,
            resource: module.slice(0, -1) || module,
            description: `${action} ${module}`,
          },
        }),
      );
    }
  }

  const ownerRole = await prisma.role.upsert({
    where: {
      tenantId_companyId_code: {
        tenantId: tenant.id,
        companyId: company.id,
        code: "COMPANY_OWNER",
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      companyId: company.id,
      name: "Company Owner",
      code: "COMPANY_OWNER",
      scope: "COMPANY",
      isSystem: true,
    },
  });

  for (const code of defaultRoles) {
    await prisma.role.upsert({
      where: { tenantId_companyId_code: { tenantId: tenant.id, companyId: company.id, code } },
      update: {},
      create: {
        tenantId: tenant.id,
        companyId: company.id,
        name: code
          .split("_")
          .map((word) => word[0] + word.slice(1).toLowerCase())
          .join(" "),
        code,
        scope: code === "SUPER_ADMIN" ? "SYSTEM" : "COMPANY",
        isSystem: true,
      },
    });
  }

  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: ownerRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: ownerRole.id,
        permissionId: permission.id,
      },
    });
  }

  const owner = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: "owner@sharmatraders.in" } },
    update: {},
    create: {
      tenantId: tenant.id,
      companyId: company.id,
      branchId: branch.id,
      email: "owner@sharmatraders.in",
      phone: "+919820012345",
      fullName: "Rajesh Sharma",
      status: "ACTIVE",
      passwordHash: await argon2.hash(
        `ChangeMe123!${process.env.PASSWORD_PEPPER ?? "dev-pepper-change-me"}`,
      ),
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date(),
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId_companyId_branchId_warehouseId: {
        userId: owner.id,
        roleId: ownerRole.id,
        companyId: company.id,
        branchId: branch.id,
        warehouseId: null,
      },
    },
    update: {},
    create: {
      userId: owner.id,
      roleId: ownerRole.id,
      companyId: company.id,
      branchId: branch.id,
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
