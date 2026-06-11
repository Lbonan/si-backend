import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

// @Controller('auth'): todas as rotas deste controller ficam sob /api/v1/auth
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/v1/auth/register
  // @Body() createUserDto: o ValidationPipe valida automaticamente o body
  // antes de chegar neste método. Se inválido, retorna 400 automaticamente.
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // POST /api/v1/auth/login
  // @HttpCode(200): por padrão POST retorna 201. Login é uma consulta, então 200 é mais semântico.
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // GET /api/v1/auth/me
  // @UseGuards(JwtAuthGuard): rota protegida. Sem token válido → 401.
  // @CurrentUser(): extrai o usuário do token (populado pelo JwtStrategy).
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    // O @Exclude() na entity cuida de remover o campo 'password' da resposta.
    return { id: user.id, name: user.name, email: user.email };
  }
}
