import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {

  @IsNotEmpty({message: "Renseigner le nom de la catégories"})
  readonly libelle : string

}
