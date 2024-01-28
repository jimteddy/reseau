import { Global, Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailController } from './mailet.controller';

@Global()
@Module({
  providers: [MailerService],
  exports: [MailerService],
  controllers: [MailController]
})
export class MailerModule {}
