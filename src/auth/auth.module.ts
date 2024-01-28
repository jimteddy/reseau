import { Module } from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt"
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { StrategyService } from './strategy.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,]),
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, StrategyService],
})
export class AuthModule {}
