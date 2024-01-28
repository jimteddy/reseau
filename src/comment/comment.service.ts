import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private eventEmitter: EventEmitter2,
  ) { }

  async create(userId: number, createCommentDto: CreateCommentDto) {
    const { postId, content } = createCommentDto
    const post = await this.eventEmitter.emitAsync('post.findOne', postId) as Post[];
    // const post = await this.eventEmitter.emitAsync({ id : postId})
    if (Array.isArray(post) && !post[0]) throw new NotFoundException("Post non existant")
    const user = await this.eventEmitter.emitAsync("auth.findOne", { id: userId })
    if (Array.isArray(user) && !user[0]) throw new UnauthorizedException("Impossible de commenter")

    const newComment = this.commentRepository.create({ content, user: user[0], post: post[0] })
    await this.commentRepository.save(newComment)
    return "commentaire ajouté"
  }

  async remove(commentId: number, userId: number, postId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: {
        user: true,
        post: true
      },
    })
    if (!comment) throw new NotFoundException('Commentaire non trouvé')
    if (comment.post.id !== postId) throw new UnauthorizedException("Post non trouvé")
    if (comment.user.id !== userId) throw new ForbiddenException('Action impossible')
    await this.commentRepository.delete({ id: commentId })
    return "Commentaire supprimé"
  }

  async update(userId: number, commentId: number, updateCommentDto: UpdateCommentDto) {
    const { postId, content } = updateCommentDto
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: {
        user: true,
        post: true
      },
    })
    if (!comment) throw new NotFoundException('Commentaire non trouvé')
    if (comment.post.id !== postId) throw new UnauthorizedException("Post non trouvé")
    if (comment.user.id !== userId) throw new ForbiddenException('Action impossible')

    await this.commentRepository.update({ id: commentId }, { content: content })
    return "Commentaire modifié"
  }

}
