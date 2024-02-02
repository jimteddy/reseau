import { Body, Controller, Delete, Post, UseGuards, Req, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemand.dto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { Request } from "express"
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto){
    return this.authService.signup(signupDto)
  }

  @Post('signin')
  signin(@Body() signinDto: SigninDto){
    return this.authService.signin(signinDto)
  }

  /*
  @Post("reset-password")
  resetPasswordDemand(@Body() resetPasswordDemandDto : ResetPasswordDemandDto){
    return this.authService.resetPasswordDemand(resetPasswordDemandDto)
  }

  @Post("reset-password-confirmation")
  resetPasswordConfirmation(@Body() resetPasswordConfirmationDto : ResetPasswordConfirmationDto){
    return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDto)
  }
*/

  @UseGuards(AuthGuard('jwt'))
  @Delete("delete")
  deleteAccount(@Req() request : Request, @Body() deleteAccountDto: DeleteAccountDto){
    const userId = request.user['id']
    return this.authService.deleteAccount(userId, deleteAccountDto);
  }
  
  @Get()
  findAll(){
    return this.authService.findAll()
  }

  @Get(":id")
  findOne(@Param('id', ParseIntPipe) id: number){
    return this.authService.findOne(id)
  }
}
