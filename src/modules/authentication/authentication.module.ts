import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccountRepository } from './repository/account.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_JWT_KEY', // à mettre dans .env
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthenticationService, AccountRepository],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
