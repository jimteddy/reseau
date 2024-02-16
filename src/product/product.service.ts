import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository : Repository<Product>,
    private readonly userService : UserService,
    private readonly categoryService : CategoryService,
  ){}

  async getUserOrError(id: number): Promise<User>{
    try {
      const user = await this.userService.findOne(id)
      if(!user) throw new UnauthorizedException("Utilisateur non autorisé")
      Reflect.deleteProperty(user, "password")
      return user
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  async getCategoryOrError(id: number): Promise<Category>{
    try {
      const cate = await this.categoryService.findOne(id)
      if(!cate) throw new NotFoundException("Categorie non trouvé")
      //Reflect.deleteProperty(cate, "password")
      return cate
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  async create(createProductDto: CreateProductDto, userId: number) {
    try {
      const {libelle, price, categoryId } = createProductDto
      const user = await this.getUserOrError(userId)
      const category = await this.getCategoryOrError(categoryId)

      const newProd = this.productRepository.create({user: user, category: category, libelle, price})
      return this.productRepository.save(newProd)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  findAll(visible: boolean) {
    return this.productRepository.find({
      where: { isVisible: visible },
      order: {"updateAt":"DESC"}
    });
  }

  async findAllByCategory(categoryId: number , visible: boolean = true) {
    const category = await this.getCategoryOrError(categoryId)    
    const products = await this.productRepository.find({
      where: {isVisible: visible , category: {id: category.id}},
      order: {"updateAt":"DESC"},
      relations: ["category", "user"],
      select: {
        category: {
          id: true,
          libelle: true
        },
        user: {
          id: true,
          nom: true,
          prenom: true,
          telephone: true
        }
      }
    });
    return products;
  }

  async findAllForUser(userId: number) {
    try {
      const user = await this.getUserOrError(userId)
      return this.productRepository.find({
        where: { user: {id: user.id} },
        order: {"updateAt":"DESC"}
      });
    } catch (error) {
      throw new BadRequestException(error.message)
    }
   
  }

  findOne(id: number) {
    return this.productRepository.findOneBy({
      id: id,
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, {...updateProductDto})
  }

  remove(id: number) {
    return this.productRepository.delete({id: id});
  }
}
