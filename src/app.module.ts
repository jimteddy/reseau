import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Auth } from './auth/entities/auth.entity';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    EventEmitterModule.forRoot({}),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config: ConfigService)=>({
        type: "postgres",
        host: "localhost",
        port: parseInt(config.get('DATABASE_PORT')),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        entities: [User, Auth],
        //entities: ['**/entities/*.entity{.ts}'],
        synchronize: true,
        autoLoadEntities: true,
      })
    }),
    AuthModule,
    UsersModule,
    MailerModule,
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
