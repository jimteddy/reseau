import { Controller, Get, Header, HttpCode, Param, Post, Req } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  @HttpCode(201)
  @Header("Cache-Control", "one")
  create(): string {
    return "Chat créé avec succès"
  }

  @Get()
  findAll(@Req() request: Request) : string {
    return "This action returns all chats"
  }
  @Get("breads")
  findBreads() : string {
    return "This action returns all for breads chats"
  }

  @Get(":id")
  findOne(@Param() params: any) : string {
    return `This action returns #${params.id} chat`;
  }
  @Get(":id")
  findGet(@Param('id') id: number) : string {
    return `This action get returns #${id} chat`;
  }
}

@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}

/**
 * 
 * 
 * @Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}

 */