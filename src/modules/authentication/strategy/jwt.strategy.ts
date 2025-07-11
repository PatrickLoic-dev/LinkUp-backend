import { config } from '../../../../config'
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from '@nestjs/common';

import { Payload } from '../dto/payload.dto';
import { AuthenticationService } from '../authentication.service';
import { Account } from 'src/interfaces/Account';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private service: AuthenticationService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('jwtSecret')
        })
    }

    async validate(payload: Payload): Promise<Account>
    {
        return await this.service.getUser({_id: payload.sub, email: payload.email}, {password:0}) as unknown as Account;
    }
}