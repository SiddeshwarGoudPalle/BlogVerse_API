import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginData: LoginDto) {
    const { email, password } = loginData;
    const user = await this.databaseService.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException('No user exists with the entered email');
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      throw new NotFoundException('Wrong Password');
    }

    return {
      token: this.jwtService.sign({ email }),
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
  }

  async register(registerData: RegisterUserDto) {
    const user = await this.databaseService.user.findUnique({
      where: { email: registerData.email }
    });

    if (user) {
      throw new ConflictException('User with this email already exists');
    }

    const name = await this.databaseService.user.findUnique({
      where: { username: registerData.username }
    });

    if (name) {
      throw new ConflictException('User with this username already exists');
    }

    registerData.password = await bcrypt.hash(registerData.password, 10);
    const res = await this.databaseService.user.create({ data: registerData });

    return {
      message: 'Registration successful.',
      user: {
        id: res.id,
        username: res.username,
        email: res.email
      }
    };
  }

  async updateEmail(currentUserEmail: string, updateEmailDto: UpdateEmailDto) {
    const { newEmail } = updateEmailDto;
    const existingUser = await this.databaseService.user.findUnique({
      where: { email: newEmail }
    });

    if (existingUser) {
      throw new ConflictException('This email is linked to another existing account');
    }

    const user = await this.databaseService.user.findUnique({
      where: { email: currentUserEmail }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.databaseService.user.update({
      where: { id: user.id },
      data: { email: newEmail }
    });

    return { message: 'Email updated successfully' };
  }

  async updateUsername(currentUserEmail: string, updateUsernameDto: UpdateUsernameDto) {
    const { newUsername } = updateUsernameDto;
    const existingUser = await this.databaseService.user.findUnique({
      where: { username: newUsername }
    });

    if (existingUser) {
      throw new ConflictException('This username is not available');
    }

    const user = await this.databaseService.user.findUnique({
      where: { email: currentUserEmail }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.databaseService.user.update({
      where: { id: user.id },
      data: { username: newUsername }
    });

    return { message: 'Username updated successfully' };
  }

  async updatePassword(currentUserEmail: string, updatePasswordDto: UpdatePasswordDto) {
    const { oldPassword, newPassword } = updatePasswordDto;
    const user = await this.databaseService.user.findUnique({
      where: { email: currentUserEmail }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const validatePassword = await bcrypt.compare(oldPassword, user.password);
    if (!validatePassword) {
      throw new NotFoundException('The old password is incorrect');
    }

    if (oldPassword === newPassword) {
      throw new ConflictException('The new and old passwords cannot be the same');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.databaseService.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return { message: 'Password updated successfully' };
  }
}
