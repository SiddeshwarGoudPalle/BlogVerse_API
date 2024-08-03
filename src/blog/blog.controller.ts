import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEmail } from '../common/decorators/user-email.decorator';

@ApiTags('Blog')
@Controller('api/blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create a new blog.', summary: 'Create Blog.' })
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @UserEmail() userEmail: string,
  ) {
    return this.blogService.createBlog(createBlogDto, userEmail);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all blogs.', summary: 'Get All Blogs.' })
  async getAllBlogs() {
    return this.blogService.getAllBlogs();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Get a blog by its ID.',
    summary: 'Get Blog by ID.',
  })
  async getBlogById(@Param('id') blogId: string) {
    return this.blogService.getBlogById(blogId);
  }

  @Get('search/title')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Get blogs by title.',
    summary: 'Get Blog by Title.',
  })
  async getBlogByTitle(@Query('title') title: string) {
    return this.blogService.getBlogByTitle(title);
  }

  @Get('search/author')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Get blogs by author username.',
    summary: 'Get Blog by Author.',
  })
  async getBlogByAuthor(@Query('username') username: string) {
    return this.blogService.getBlogByAuthor(username);
  }

  @Get('search/user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Get blogs by user ID.',
    summary: 'Get Blog by User ID.',
  })
  async getBlogByUserId(@Query('userId') userId: string) {
    return this.blogService.getBlogByUserId(userId);
  }

  @Get('search/genre')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Get blogs by genre.',
    summary: 'Get Blog by Genre.',
  })
  async getBlogByGenre(@Query('genre') genre: string) {
    return this.blogService.getBlogByGenre(genre);
  }

  @Get('search/user-email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Get blogs by user email.',
    summary: 'Get Blog by User Email.',
  })
  async getBlogByUserEmail(@Query('userEmail') userEmail: string) {
    return this.blogService.getBlogByUserEmail(userEmail);
  }

  @Get('search/unique-genre')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Get all unique genres present in blogs.',
    summary: 'Get All Unique Genres.',
  })
  async getAllUniqueGenres() {
    return this.blogService.getAllUniqueGenres();
  }

  @Get('search/price/sort')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Sort blogs by price (low to high or high to low).',
    summary: 'Sort Blogs by Price.',
  })
  async getBlogsSortedByPrice(@Query('sort') sort: 'asc' | 'desc' = 'asc') {
    if (sort !== 'asc' && sort !== 'desc') {
      throw new BadRequestException(
        'Invalid sort parameter. Valid values are "asc" and "desc".',
      );
    }
    return this.blogService.getBlogsSortedByPrice(sort);
  }
}
