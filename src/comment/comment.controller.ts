import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Request } from 'express';
import { CreateCommentDto } from './dto/createComment.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Commentaires')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Req() request: Request, @Body() createCommentDto: CreateCommentDto ){
    const userId = request.user['id']
    return this.commentService.create(userId, createCommentDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(
    @Req() request: Request, 
    @Param('id', ParseIntPipe) commentId : number, 
    @Body("postId") postId: number ){
    const userId = request.user['id']
    return this.commentService.remove(commentId, userId, postId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(
    @Req() request: Request, 
    @Param('id', ParseIntPipe) commentId : number, 
    @Body() updateCommentDto: UpdateCommentDto,
    ){
      const userId = request.user['id']
      return this.commentService.update(userId, commentId, updateCommentDto)
  }

}
