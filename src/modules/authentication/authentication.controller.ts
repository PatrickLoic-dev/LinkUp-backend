import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Account } from 'src/interfaces/Account';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() account: Account) {
    return this.authenticationService.register(account);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto.email, loginDto.password);
  }
}
