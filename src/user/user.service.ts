import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto)
    return this.userRepository.save(newUser)
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({id: id})
  }

  findOneByPhone(phone : string){
    return this.userRepository.findOneBy({telephone: phone})
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, {...updateUserDto})
  }

  remove(id: number) {
    return this.userRepository.delete(id)
  }
}
