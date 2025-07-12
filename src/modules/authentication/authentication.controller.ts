import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Account } from 'src/interfaces/Account';
import { LoggerService } from 'src/common/logging/logging.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService, private readonly logger: LoggerService) {}

  @Post('register')
  async register(@Body() account: Account) {
    this.logger.log(`Compte avec email ${account.email} créé`);
    return this.authenticationService.register(account);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Tentative de connexion pour l'email ${loginDto.email}`);
    return this.authenticationService.login(loginDto.email, loginDto.password);
  }
}
