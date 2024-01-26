import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: 'jimik',
      password: 'jimik2007life',
      database: "reseau",
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),

    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
