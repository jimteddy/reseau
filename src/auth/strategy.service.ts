import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy,  ExtractJwt } from "passport-jwt";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

type Payload = {
  sub: number,
  email: string
}

@Injectable()
export class StrategyService extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ){
    super({
      jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey : "coucou",
      ignoreExpiration : true, //expiration du token 
    })
  }

  async validate(payload : Payload){
    const user = await this.userRepository.findOneBy({email : payload.email})
    if (!user) throw new UnauthorizedException('Non autorisé')
    Reflect.deleteProperty(user, "password")
    return user;
  }
}