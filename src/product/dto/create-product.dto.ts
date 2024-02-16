import { IsNotEmpty, Length } from "class-validator";


export class CreateProductDto {

  @IsNotEmpty({message: "Rentrer le nom du produit"})
  @Length(2, 150)
  readonly libelle : string;
  
  @IsNotEmpty({message: "Rentrer le prix du produit"})
  readonly price : number;
  
  @IsNotEmpty({message: "Rentrer la catégorie du produit"})
  readonly categoryId : number;
}
