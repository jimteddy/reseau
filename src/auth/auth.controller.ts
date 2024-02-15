import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { Request } from 'express';
import { DeleteAccountDto } from './dto/delete.account.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signup(@Body() signupDto: SignupDto){
    return this.authService.signup(signupDto)
  }

  @Post("signin")
  signin(@Body() signinDto: SigninDto){
    return this.authService.signin(signinDto)
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete('delete')
  deleteAccount(@Req() request: Request, @Body() deleteAccountDto : DeleteAccountDto){
    const userId = request.user["id"]
    console.log(userId);
    return this.authService.deleteAccount(userId, deleteAccountDto)
  }
 
}
