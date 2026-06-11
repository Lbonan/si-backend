import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    // JwtService: injetado pelo JwtModule (configurado no AuthModule).
    // Responsável por assinar (criar) e verificar tokens JWT.
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    // Após criar, já retorna o token para o usuário não precisar fazer login separado.
    const token = this.generateToken(user.id, user.email);
    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken: token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    // Nunca diga "senha errada" ou "e-mail não encontrado" separadamente.
    // Ambos retornam a mesma mensagem genérica para não revelar quais e-mails existem.
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // bcrypt.compare(): compara a senha em texto puro com o hash salvo no banco.
    // Nunca compare strings direto — o hash muda a cada geração por causa do salt.
    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.generateToken(user.id, user.email);
    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken: token,
    };
  }

  private generateToken(userId: string, email: string): string {
    // O payload do JWT é o que ficará VISÍVEL (decodificável) no token.
    // Não coloque informações sensíveis aqui (senha, dados financeiros).
    // 'sub' é o campo padrão do JWT para identificar o sujeito (subject).
    return this.jwtService.sign({ sub: userId, email });
  }
}
