import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.user?.role !== 'owner') {
      throw new ForbiddenException('Bu işlem sadece sahip tarafından yapılabilir');
    }
    return true;
  }
}
