import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
//import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { CatalogueModule } from './catalogue/catalogue.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { Product } from './product/entities/product.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { User } from './user/entities/user.entity';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    //EventEmitterModule.forRoot({}),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config: ConfigService)=>({
        type: "postgres",
        host: "localhost",
        port: parseInt(config.get('DATABASE_PORT')),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        entities: [Category, Product, User ],
        //entities: ['**/entities/*.entity{.ts}'],
        synchronize: true,
        autoLoadEntities: true,
      })
    }),
    AuthModule,
    CatalogueModule,
    ProductModule,
    UserModule,
    CategoryModule,
  
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
