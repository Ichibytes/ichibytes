import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { SKIP_THROTTLE_KEY } from "../decorators/skip-throttle.decorator";

@Injectable()
export class CustomThrottleGuard extends ThrottlerGuard {
  constructor(options: any, storageService: any, reflector: Reflector) {
    super(options, storageService, reflector);
  }

  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    // Check for built-in @nestjs/throttler SkipThrottle decorator
    const builtInSkip = await super.shouldSkip(context);
    if (builtInSkip) {
      return true;
    }

    // Check for custom SkipThrottle decorator
    const customSkip = this.reflector.getAllAndOverride<boolean>(
      SKIP_THROTTLE_KEY,
      [context.getHandler(), context.getClass()]
    );

    return customSkip || false;
  }
}
