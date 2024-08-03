import { Controller, Post, Patch, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from './auth.guard';
import { UserEmail } from '../common/decorators/user-email.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/Register')
  @ApiOperation({
    description: 'Register a new user with email.',
    summary: 'Register a User.',
  })
  create(@Body() registerData: RegisterUserDto) {
    return this.authService.register(registerData);
  }

  @Post('/Login')
  @ApiOperation({
    description: 'Login with email and password.',
    summary: 'Login a User.',
  })
  login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('update-email')
  @ApiOperation({ description: 'Update user email.', summary: 'Update Email.' })
  updateEmail(
    @UserEmail() userEmail: string,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    return this.authService.updateEmail(userEmail, updateEmailDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('update-username')
  @ApiOperation({
    description: 'Update username.',
    summary: 'Update Username.',
  })
  updateUsername(
    @UserEmail() userEmail: string,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ) {
    return this.authService.updateUsername(userEmail, updateUsernameDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('update-password')
  @ApiOperation({
    description: 'Update password.',
    summary: 'Update Password.',
  })
  updatePassword(
    @UserEmail() userEmail: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(userEmail, updatePasswordDto);
  }

  // New endpoint for fetching user details
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('details')
  @ApiOperation({
    description: 'Get details of the currently logged-in user.',
    summary: 'Get User Details.',
  })
  getUserDetails(@UserEmail() userEmail: string) {
    return this.authService.getUserDetails(userEmail);
  }
}
