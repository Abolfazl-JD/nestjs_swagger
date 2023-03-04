import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(private readonly authService: AuthService){}

  async canActivate(context: ExecutionContext): Promise<boolean>{
      const req = context.switchToHttp().getRequest()
      console.log('request', req)
      console.log('req cookies : ', req.cookies)
      if(!req.cookies?.Authentication) throw new UnauthorizedException('no cookies were found, consider signing up/in')
        console.log('\n request cookies are: ', req.cookies)
        const { Authentication: accessToken } = req.cookies
        console.log('\n token is exported from authentication', accessToken)
        try {
            const user = await this.authService.verifyAccessToken(accessToken)
            req.user = user
            return true
        } catch (error) {
            console.log('error happended')
            throw new BadRequestException("couldn't verify the token", "consider logging out again")
        }
    }
}