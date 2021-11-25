import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggedInDto } from './dto';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly _authServie: AuthService) {}

    @Post('/signup')
    @UsePipes(ValidationPipe)
    signup(@Body() signupDto: SignupDto): Promise<void> {
        return this._authServie.signup(signupDto);
    }

    @Post('/signin')
    @UsePipes(ValidationPipe)
    signin(@Body() signinDto: SigninDto): Promise<LoggedInDto> {
        return this._authServie.signin(signinDto);
    }

}
