import { AuthorizedReq } from 'src/common/types/authorized-req';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UpdateUserGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request: AuthorizedReq = context.switchToHttp().getRequest()
        const { id } = request.params
        const { _id: userId } = request.user
        if(id === userId.toString()) return true
        else throw new ForbiddenException("can't edit someone else's info")
    }
}