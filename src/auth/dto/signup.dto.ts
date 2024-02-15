import { IsNotEmpty, Length } from "class-validator";

export class SignupDto{

  @IsNotEmpty({message: "Renseigner votre nom"})
  readonly nom: string;

  @IsNotEmpty({message: "Renseigner votre prénom"})
  readonly prenom: string;

  @Length(9, 12, {message : "Numéro incorect"})
  @IsNotEmpty({message: "Renseigner un numéro de téléphone"})
  readonly telephone: string;
  
  @IsNotEmpty({message: "Renseigner un mot de passe"})
  readonly password: string;

}