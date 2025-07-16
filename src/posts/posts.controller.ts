import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Query,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { UsersService } from '../users/users.service'; // ✅ Import UsersService
import { User } from '../users/entities/user.entity';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService, // ✅ Inject UsersService
  ) {}

  @Get()
  getAllPosts(@Query('page') page: string) {
    return this.postsService.getAllPosts(Number(page) || 1);
  }

  @HttpPost()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @Body() dto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required.');
    }

    // ✅ Attach uploaded image URL
    dto.image = `http://localhost:3000/uploads/${file.filename}`;

    // ✅ Validate required fields
    if (!dto.title || !dto.subtitle || !dto.description || !dto.image) {
      throw new BadRequestException('All fields must be provided.');
    }

    // ✅ Extract user ID from request and fetch full user entity
    const userId = (req.user as any)?.id;
    if (!userId) {
      throw new BadRequestException('Invalid user.');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
	throw new BadRequestException('User not found.');
    }

    return this.postsService.createPost(dto, user);
  }
}

