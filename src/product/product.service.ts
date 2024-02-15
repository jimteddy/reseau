import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository : Repository<Product>,
  ){}

  create(createProductDto: CreateProductDto) {
    const newProd = this.productRepository.create(createProductDto)
    return this.productRepository.save(newProd)
  }

  findAll() {
    return this.productRepository.find({
      order: {"updateAt":"DESC"}
    });
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
