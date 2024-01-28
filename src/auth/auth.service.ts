import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import * as speakeasy from 'speakeasy';
import { User } from 'src/entities/user.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemand.dto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailerService : MailerService,
    private readonly jwtService: JwtService,
    private readonly config : ConfigService
  ) { }

  async signup(signupDto: SignupDto) {
    const { email, password, username } = signupDto;
    const user = await this.userRepository.findOneBy({ email });
    if (user) throw new ConflictException("L'utilisateur exist déja");
    const hash = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({ email, username, password: hash })
    return this.userRepository.save(newUser)
   // await this.mailerService.sendSignupConfirmation(newUser.email)
    return 'Utilisateur crée avec succèes !'
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto

    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const pwdtest = await bcrypt.compare(password, user.password);

    if (!pwdtest) throw new UnauthorizedException('Mot de passe incorrect')

    const payload = {
      sub: user.id,
      email: user.email
    }
    const token = this.jwtService.sign(payload, { expiresIn: '2h', secret: this.config.get('SECRET_KEY') });

    return {
      token, 
      user : {
        username : user.username, 
        email : user.email
      }
    }
  }

  async resetPasswordDemand(resetPasswordDemandDto: ResetPasswordDemandDto) {
    const { email } = resetPasswordDemandDto;
    const user = await this.userRepository.findOneBy({email})
    if (!user) throw new NotFoundException('User non trouvé')
    const code = speakeasy.totp({
      secret: this.config.get('SECRET_KEY'),
      digits: 5,
      step:  60 * 15, //durré
      encoding: "base32"
    })
    const url = "http://localhost:3000/auth/reset-password-confirmation";

    await this.mailerService.sendResetPassword(email, url, code)

    return "Le mot de passe a été reinitialisé !"
  }

  async resetPasswordConfirmation(resetPasswordConfirmationDto: ResetPasswordConfirmationDto) {
    const {email, code, password} = resetPasswordConfirmationDto
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    const testCode = speakeasy.totp.verify({
      secret: this.config.get('OTP_CODE'),
      token: code,
      digits: 5,
      step:  60 * 15, //durré
      encoding: "base32"
    })
    if(!testCode) throw new UnauthorizedException('Invalid/expired token')
    const hash = await bcrypt.hash(password, 10)
    user.password = hash
    await this.userRepository.update({email}, user)
    return user
    
  }

  async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto) {
    const {password} = deleteAccountDto
    const user = await this.userRepository.findOneBy({ id : userId });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const pwdtest = await bcrypt.compare(password, user.password);
    if (!pwdtest) throw new UnauthorizedException('Mot de passe incorrect')

    await this.userRepository.delete({id : userId})

    return "Utilisateur supprimé avec succès"
  }
  
  @OnEvent('auth.findOne')
  async findOne(id: number){
    return await this.userRepository.findOneBy({id})
  }
  
  @OnEvent('auth.findAll')
  async findAll(){
    return await this.userRepository.find()
  }

}
