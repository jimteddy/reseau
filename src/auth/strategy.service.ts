import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy,  ExtractJwt } from "passport-jwt";
import { Repository } from "typeorm";
import { Auth } from "./entities/auth.entity";
import { ConfigService } from "@nestjs/config";

type Payload = {
  sub: number,
  email: string
}

@Injectable()
export class StrategyService extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private readonly config: ConfigService
  ){
    super({
      jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey : config.get('SECRET_KEY'),
      ignoreExpiration : true, //expiration du token 
    })
  }

  async validate(payload : Payload){
    const auth = await this.authRepository.findOneBy({email : payload.email})
    if (!auth) throw new UnauthorizedException('Non autorisé')
    Reflect.deleteProperty(auth, "password")
    return auth;
  }
}