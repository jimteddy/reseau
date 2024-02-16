import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post("create")
  create(@Body() createProductDto: CreateProductDto, @Req() request: Request) {
    try {
      const userId = request.user["id"] 
      return this.productService.create(createProductDto, userId);
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  
  @Get()
  findAll() {
    return this.productService.findAll(true);
  }
  
  @Get("cat/:id")
  async findAllBycategory(@Param("id", ParseIntPipe) categoryId: number) {
    try {      
      const products = await this.productService.findAllByCategory(categoryId);
      return products
    } catch (error) {
      return error.message
    }
  }
  
  @Get("user/:id")
  async findAllByUser(@Param("id", ParseIntPipe) userId: number) {
    try {      
      const products = await this.productService.findAllForUser(userId);
      return products
    } catch (error) {
      return error.message
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
