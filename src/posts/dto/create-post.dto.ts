import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  subtitle: string;

  // Optional because image is added in controller
  image?: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

