import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from "bcrypt";
import { SignupDto } from './dto/signup.dto';
import { UserService } from 'src/user/user.service';
import { SigninDto } from './dto/signin.dto';
import { DeleteAccountDto } from './dto/delete.account.dto';


@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService : JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ){}

 async signup(signupDto : SignupDto){
  const {telephone, password, nom, prenom} = signupDto

  const testUser = await this.userService.findOneByPhone(telephone)
  if(testUser) throw new ConflictException('Utilisateur existe déja')

  const hash = await bcrypt.hash(password, 10)

  const newUser = await this.userService.create({password: hash, nom, prenom, telephone})

  return { data : {message: "Utilisateur crée", user: newUser } }
 }

 async signin(signinDto: SigninDto){
  const {password, telephone} = signinDto
  const user = await this.userService.findOneByPhone(telephone)
  if(!user) throw new NotFoundException("Le numéro de téléphone n'existe pas")

  const testPwd = await bcrypt.compare(password, user.password)
  if (!testPwd) throw new UnauthorizedException('Mot de passe incorect')

  const token = this.jwtService.sign(
    {sub: user.id, telephone: user.telephone},
    {expiresIn: "2h", secret: this.configService.get('SECRET_KEY')}
    )
    const payload: Payload = {
      id: user.id,
      telephone : user.telephone,
    }
  return {
    token,
    payload
  }
 }

 async deleteAccount(userId: any, deleteAccountDto: DeleteAccountDto) {
  const user = await this.userService.findOne(userId) 
  if (!user) throw new NotFoundException('Utilisateur non trouvé')

  const testPwd = await bcrypt.compare(deleteAccountDto.password, user.password)
  if (!testPwd) throw new UnauthorizedException('Le mot de passe est incorect')

  await this.userService.remove(userId)
  return {message : "Utilisateur supprimé avec succès"}
 }
 
}
