import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PermissionsGuard } from "./permissions.guard";

describe("PermissionsGuard", () => {
  it("allows a user with all required permissions", () => {
    const reflector = {
      getAllAndOverride: jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(["users:read:user"]),
    } as unknown as Reflector;
    const guard = new PermissionsGuard(reflector);

    expect(guard.canActivate(contextWithPermissions(["users:read:user"]))).toBe(true);
  });

  it("denies a user missing a required permission", () => {
    const reflector = {
      getAllAndOverride: jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(["users:delete:user"]),
    } as unknown as Reflector;
    const guard = new PermissionsGuard(reflector);

    expect(guard.canActivate(contextWithPermissions(["users:read:user"]))).toBe(false);
  });
});

function contextWithPermissions(permissions: string[]): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user: { permissions } }),
    }),
  } as unknown as ExecutionContext;
}
