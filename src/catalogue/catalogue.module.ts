import { Module } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { CatalogueController } from './catalogue.controller';

@Module({
  controllers: [CatalogueController],
  providers: [CatalogueService],
})
export class CatalogueModule {}
