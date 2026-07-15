import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "node:async_hooks";
import type { TenantContext } from "./tenant-context.types";

@Injectable()
export class TenantContextService {
  private readonly storage = new AsyncLocalStorage<TenantContext>();

  run<T>(context: TenantContext, callback: () => T): T {
    return this.storage.run(context, callback);
  }

  get(): TenantContext | undefined {
    return this.storage.getStore();
  }

  getRequired(): TenantContext {
    const context = this.get();
    if (!context?.tenantId) {
      throw new Error("Tenant context is not available for this request");
    }
    return context;
  }
}
