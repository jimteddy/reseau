import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UpdatePostDto } from './dto/updatePost.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post) private postRepository : Repository<Post>,
    private eventEmitter: EventEmitter2,
  ){}

  async create(createPostDto: CreatePostDto, id: number) {
    const { body, title} = createPostDto
    const user = await this.eventEmitter.emitAsync('auth.findOne', id) as User[];
    if (Array.isArray(user) && !user[0]) throw new ForbiddenException("Compte inexistant");
    user[0]
    const newPost = this.postRepository.create({title, body, user: user[0]})
    await this.postRepository.save(newPost)
    return "Post crée !"
  }

  @OnEvent('post.findAll')
  async findAll() {
    return await this.postRepository.find({
      relations : ['user', 'comments'],
      select : {
        user: {
          username: true,
          email: true,
          password: false,
        },
        comments: true
      },
    })
  }
  
  @OnEvent('post.findOne')
  findOne(id: number) {
    try {
      return this.postRepository.findOneBy({id});   
    } catch (error) {
      return null;
    }
  }

  async update(postId: number, userId: number, updatePostDto : UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: {id: postId}, 
      relations : { 
        user: true,      
    }, 
    select : {
      user: {
        id: true,
        email: true,
        username: true,
      }
    }
  })
    if(!post) throw new NotFoundException('Post non trouvé')
    if(post.user.id !== userId) throw new UnauthorizedException('Impossible de suppimer le post')
    await this.postRepository.update({id: postId}, {...updatePostDto})
    return "Post modifié !"
  }

  async remove(postId: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: {id: postId}, 
      relations : { 
        user: true,      
    }, 
    select : {
      user: {
        id: true,
        email: true,
        username: true,
      }
    }
  })
    if(!post) throw new NotFoundException('Post non trouvé')
    if(post.user.id !== userId) throw new UnauthorizedException('Impossible de suppimer le post')
    await this.postRepository.delete({ id: postId})
    return "Post supprimé !"
  }
}
