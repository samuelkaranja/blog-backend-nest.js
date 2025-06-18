import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // GET /posts?page=1
  @Get()
  getAllPosts(@Query('page') page: string) {
    return this.postsService.getAllPosts(Number(page) || 1);
  }

  // POST /posts (Protected)
  @HttpPost()
  @UseGuards(JwtAuthGuard)
  createPost(@Body() dto: CreatePostDto, @Req() req: Request) {
    // req.user set by JwtStrategy
    return this.postsService.createPost(dto, req.user as any);
  }
}
