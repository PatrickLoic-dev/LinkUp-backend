import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountRepository } from './repository/account.repository';
import { Account } from '../../interfaces/Account';
import * as bcrypt from 'bcrypt';
import { config } from '../../../config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Payload } from './dto/payload.dto';


@Injectable()
export class AuthenticationService {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(account: Account) {
    const createdAccount = await this.accountRepo.createAccount(account);
    return { account: createdAccount };
  }

  async login(email: string, password: string) {
    const account = await this.accountRepo.findByEmail(email);
    if (!account) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, account.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const token = await this.generateToken(account._id, account.email);
    return { account, token };
  }

  async verifyExperienceAndAuthorize(email: string) {
    const account = await this.accountRepo.findByEmail(email);
    if (!account) throw new UnauthorizedException('User not found');
  
    const today = new Date();
  
    // const isCurrentlyInCompany = account.experience.some((job) => {
    //   const startDate = new Date(job.startDate);
    //   const endDate = job.endDate ? new Date(job.endDate) : null;
  
    //   return startDate <= today && (!endDate || endDate > today);
    // });
  
    // if (!isCurrentlyInCompany) {
    //   throw new UnauthorizedException('User is not currently in a company');
    // }
  
    return { authorized: true, account };
  }

  async getUser(filter: Partial<Account>, projection?: Record<string, any>) {
    const account = await this.accountRepo.getBy(filter, projection);
    if (!account) throw new UnauthorizedException('User not found');
    return account;
  }

  async refreshToken(token : RefreshTokenDto) {
    const payload = this.jwtService.decode(token.currentToken) as unknown as Payload;
    return this.generateToken(payload.sub, payload.email);
  }

  private async generateToken(userId:string, email: string) {
   const payload = { sub: userId, email };

   const token = this.jwtService.sign(payload, {
     secret: config.get('jwtSecret'),
     expiresIn: '1d',
   });

   return token;
  }
}