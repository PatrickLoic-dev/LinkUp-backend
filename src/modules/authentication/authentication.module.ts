import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccountRepository } from './repository/account.repository';
import { LoggerService } from 'src/common/logging/logging.service';
import { config } from '../../../config';

@Module({
  imports: [
    JwtModule.register({
      secret: config.get('jwtSecret'), // à mettre dans .env
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthenticationService, AccountRepository, LoggerService],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
