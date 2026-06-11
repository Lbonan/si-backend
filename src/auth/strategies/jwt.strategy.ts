import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

// O Passport é uma biblioteca de autenticação para Node.js.
// Uma "Strategy" ensina ao Passport como autenticar usando um método específico.
// Aqui: JwtStrategy ensina a extrair e validar um JWT Bearer Token.

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: process.env.JWT_SECRET || 'supersecret',
    });
  }
  // validate(): chamado automaticamente pelo Passport APÓS verificar a assinatura.
  // O parâmetro 'payload' é o conteúdo decodificado do token (o que colocamos no sign()).
  // O que retornar aqui fica disponível como req.user em qualquer controller protegido.
  async validate(payload: { sub: string; email: string }) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }
    return user;
  }
}
