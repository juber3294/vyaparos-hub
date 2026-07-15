import { Injectable } from "@nestjs/common";
import { RbacRepository } from "./rbac.repository";

@Injectable()
export class RbacService {
  constructor(private readonly repository: RbacRepository) {}

  getUserSecurityProfile(userId: string, tenantId: string) {
    return this.repository.getUserSecurityProfile(userId, tenantId);
  }

  hasAllPermissions(userId: string, tenantId: string, required: string[]) {
    return this.repository.hasAllPermissions(userId, tenantId, required);
  }
}
