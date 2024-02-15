import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository : Repository<Category>
  ){}

  create(createCategoryDto: CreateCategoryDto) {
    const newCat = this.categoryRepository.create(createCategoryDto)
    return this.categoryRepository.save(newCat)
  }

  findAll() : Promise<[Category[], number]> {
    return this.categoryRepository.findAndCount({
      order: {"updateAt":"DESC"}
    });
  }

  findOne(id: number) {
    return this.categoryRepository.findOneOrFail({
      where : {id: id},
    })
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, {...updateCategoryDto});
  }

  remove(id: number) {
    return this.categoryRepository.delete(id)
  }
}
