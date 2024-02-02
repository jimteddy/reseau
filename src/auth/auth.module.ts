import { Module } from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt"
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { StrategyService } from './strategy.service';
import { Auth } from './entities/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth,]),
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, StrategyService],
})
export class AuthModule {}
