import { IsNotEmpty, Length } from "class-validator";

export class SigninDto{

  @Length(12)
  @IsNotEmpty({message: "Renseigner un numéro de téléphone"})
  readonly telephone: string;
  
  @IsNotEmpty({message: "Renseigner un mot de passe"})
  readonly password: string;
  
}