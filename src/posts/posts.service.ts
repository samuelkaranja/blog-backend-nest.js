import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  async createPost(dto: CreatePostDto, user: User) {
    const post = this.postRepo.create({ ...dto, author: user });
    return this.postRepo.save(post);
  }

  async getAllPosts(page: number = 1, limit: number = 6) {
    return this.postRepo.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['author'],
    });
  }

  async findById(id: number) {
    return this.postRepo.findOne({ where: { id }, relations: ['author'] });
  }
}
