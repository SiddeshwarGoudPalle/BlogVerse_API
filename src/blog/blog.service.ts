import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createBlog(createBlogDto: CreateBlogDto, userEmail: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isFree = createBlogDto.price === 0;

    const blog = await this.databaseService.blog.create({
      data: {
        title: createBlogDto.title,
        content: createBlogDto.content,
        price: createBlogDto.price,
        isFree: isFree,
        genre: createBlogDto.genre,
        authorId: user.id,
      },
    });

    return {
      message: 'Blog created successfully.',
      blog: {
        blog_id: blog.id,
        title: blog.title,
        content: blog.content,
        price: blog.price,
        is_free: blog.isFree,
        status: 'published',
      },
    };
  }

  async getAllBlogs() {
    return this.databaseService.blog.findMany({
      include: { author: true },
    });
  }

  async getBlogById(blogId: string): Promise<Blog> {
    const blog = await this.databaseService.blog.findUnique({
      where: { id: blogId },
      include: { author: true },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async getBlogByTitle(title: string): Promise<Blog[]> {
    return this.databaseService.blog.findMany({
      where: { title: { contains: title, mode: 'insensitive' } },
      include: { author: true },
    });
  }

  async getBlogByAuthor(username: string): Promise<Blog[]> {
    const author = await this.databaseService.user.findUnique({
      where: { username },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return this.databaseService.blog.findMany({
      where: { authorId: author.id },
      include: { author: true },
    });
  }

  async getBlogByUserId(userId: string): Promise<Blog[]> {
    const blogs = await this.databaseService.blog.findMany({
      where: { authorId: userId },
      include: { author: true },
    });

    if (blogs.length === 0) {
      throw new NotFoundException('No blogs found for this user');
    }

    return blogs;
  }

  async getBlogByGenre(genre: string): Promise<Blog[]> {
    return this.databaseService.blog.findMany({
      where: { genre: { contains: genre, mode: 'insensitive' } },
      include: { author: true },
    });
  }
}
