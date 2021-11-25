import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
import { AuthRepository } from './auth.repository';
import { LoggedInDto } from './dto';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthRepository)
        private readonly _authRopository: AuthRepository,
        private readonly _jwtService: JwtService
    ){}

    async signup(signupDto: SignupDto): Promise<void> {
        const {username, email} = signupDto;
        const userExists = await this._authRopository.findOne({
            where: [{ username }, { email }],
        });

        if(userExists){
            throw new ConflictException("Username or email already exists");
        }

        return this._authRopository.signup(signupDto);
    }

    async signin(signinDto: SigninDto): Promise<LoggedInDto> {
        const { username, password } = signinDto;
        const user: User = await this._authRopository.findOne({
            where: { username },
        });

        if(!user) {
            throw new NotFoundException("user does not exist");
        }

        const isWatch = await compare(password, user.password);

        if(!isWatch) {
            throw new UnauthorizedException("invalid credentials");
        }

        const payload: IJwtPayload = {
            id: user.id,
            email: user.email,
            username: user.username,
            roles: user.roles.map(r => r.name as RoleType)
        }

        const token = this._jwtService.sign(payload);

        return plainToClass(LoggedInDto, {token, user});
    }
}
