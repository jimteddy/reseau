import { Controller, Get, Injectable } from "@nestjs/common";
import { MailerService } from "./mailer.service";

@Controller("mail")
export class MailController{
  constructor(private mail:MailerService){}

  @Get()
  async text(){
    return this.mail.sendSignupConfirmation('jr.ikounga@gmail.com')
  }

}