import { IsNotEmpty } from "class-validator";

export class DeleteAccountDto{
  
  @IsNotEmpty({message: "Renseigner un mot de passe"})
  readonly password: string;

}