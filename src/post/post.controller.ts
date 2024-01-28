import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe, Put, } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/createPost.dto';
import { Request, request } from 'express';
import { UpdatePostDto } from './dto/updatePost.dto';
import { ApiTags } from '@nestjs/swagger';


@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createPostDto : CreatePostDto, @Req() request : Request) {
    const userId = request.user['id']
    return this.postService.create(createPostDto, userId);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @ApiTags('Publictions')
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) postId: number, 
    @Body() updatePostDto : UpdatePostDto, 
    @Req() request : Request) {
    const userId = request.user['id']
    return this.postService.update(postId, userId,updatePostDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) postId: number, 
    @Req() request : Request) {
      const userId = request.user['id']
      return this.postService.remove(postId, userId);
  }
}
