import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor( 
    private readonly configService : ConfigService,
    private readonly userService : UserService,
  ){
    super({
      jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET_KEY'),
      ignoreExpiration: false
    })
  }

  async validate(payload: Payload){
    const user = await this.userService.findOneByPhone(payload.telephone)
    if(!user) throw new UnauthorizedException("Non autorisé")
    Reflect.deleteProperty(user, "password")
    return user
  }

}