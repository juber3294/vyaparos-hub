import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma/prisma.service";

@Injectable()
export class RbacRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserSecurityProfile(
    userId: string,
    tenantId: string,
  ): Promise<{ roles: string[]; permissions: string[] }> {
    const assignments = await this.prisma.userRole.findMany({
      where: { userId, user: { tenantId } },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    });

    const roles: string[] = assignments.map((assignment) => assignment.role.code);
    const permissions = assignments.flatMap((assignment) =>
      assignment.role.permissions.map(({ permission }) =>
        [permission.module, permission.action, permission.resource].join(":"),
      ),
    );

    return {
      roles: [...new Set(roles)],
      permissions: [...new Set(permissions)],
    };
  }

  async hasAllPermissions(userId: string, tenantId: string, required: string[]) {
    if (required.length === 0) {
      return true;
    }

    const profile = await this.getUserSecurityProfile(userId, tenantId);
    const granted = new Set(profile.permissions);
    return required.every((permission) => granted.has(permission));
  }
}
