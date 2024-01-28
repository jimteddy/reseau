import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import *  as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  constructor(private configService: ConfigService) { }
  private async transporter() {
    const textAccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({

      host: this.configService.get('MAIL_HOST') ? this.configService.get('MAIL_HOST') : 'localhost',
      port: 465,
      ignoreTLS: true,
      auth: {
        user: this.configService.get('MAIL_USER') ? this.configService.get('MAIL_USER') : textAccount.user,
        pass: this.configService.get('MAIL_PASS') ? this.configService.get('MAIL_PASS') : textAccount.user
      }
    })
    return transport
  }

  async sendSignupConfirmation(userMail: string) {
    (await this.transporter()).sendMail({
      from: 'ikteddy54@gmail.com',
      to: userMail,
      subject: "Inscription",
      html: "<h3>CONFIRMATION DE L'INSCRIPTION</H3>"
    });
  }

  async sendResetPassword(userMail: string, url: string, code: string) {
    (await this.transporter()).sendMail({
      from: 'textUrlApp@localhost.com',
      to: userMail,
      subject: "RESET PASSWORD",
      html: `
          <a href="${url}" >Reset password</a>
          <p>Secret code <strong>${code}</strong></p>
          <p>Le code va expirer en 15 minutes</p>
        `
    });
  }
}
