import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import * as speakeasy from 'speakeasy';
import { MailerService } from 'src/mailer/mailer.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemand.dto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { Auth } from './entities/auth.entity';
import { log } from 'console';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private readonly eventEmitter: EventEmitter2,
    private readonly mailerService : MailerService,
    private readonly jwtService: JwtService,
    private readonly config : ConfigService
  ) { }

  async signup(signupDto: SignupDto) {
    const { email, password, username } = signupDto;

    const verify_username = await (await this.eventEmitter.emitAsync("users.verify_username", username)).pop()
    if (verify_username === true) throw new ConflictException(`${username} exist déja`)

    const auth = await this.authRepository.findOneBy({ email });
    if (auth) throw new ConflictException("L'utilisateur exist déja");
    const hash = await bcrypt.hash(password, 10);

    const newUser : User | null = (await this.eventEmitter.emitAsync("users.create_user", {username})).pop()
    if(!newUser) throw new NotFoundException('Pas trouvé')
    const newAuth = this.authRepository.create({ email, password: hash, user: newUser })
    return await this.authRepository.save(newAuth)

   // await this.mailerService.sendSignupConfirmation(newUser.email)
    return 'Utilisateur crée avec succèes !' 
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto

    const auth = await this.authRepository.findOne({ 
      where : {email}, 
      relations: ['user',],
      select: {
        "user": { 
          username: true, 
          nom: true,
          prenom: true,
          birthday: true,
          sexe: true,
        }
      }
    });
    if (!auth) throw new NotFoundException('Utilisateur non trouvé');

    const pwdtest = await bcrypt.compare(password, auth.password);

    if (!pwdtest) throw new UnauthorizedException('Mot de passe incorrect')

    const payload = {
      sub: auth.id,
      email: auth.email,
      user: auth.user
    }
    const token = this.jwtService.sign(payload, { expiresIn: '2h', secret: this.config.get('SECRET_KEY') });

    return {
      token, 
      user_auth : {
        user : auth.user,
        email : auth.email
      }
    }
  }

  /*
  async resetPasswordDemand(resetPasswordDemandDto: ResetPasswordDemandDto) {
    const { email } = resetPasswordDemandDto;
    const user = await this.authRepository.findOneBy({email})
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
    const user = await this.authRepository.findOneBy({ email });
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
    await this.authRepository.update({email}, user)
    return user
    
  }*/

  async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto) {
    const {password} = deleteAccountDto
    const auth = await this.authRepository.findOneBy({ id : userId });
    if (!auth) throw new NotFoundException('Utilisateur non trouvé');

    const pwdtest = await bcrypt.compare(password, auth.password);
    if (!pwdtest) throw new UnauthorizedException('Mot de passe incorrect')

    await this.authRepository.delete({id : userId})

    return "Utilisateur supprimé avec succès"
  }
  
  @OnEvent('auth.findOne')
  async findOne(id: number){
    return await this.authRepository.findOneBy({id})
  }
  
  @OnEvent('auth.findAll')
  async findAll(){
    return await this.authRepository.find()
  }
  
}
