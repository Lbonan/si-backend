import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard é um "porteiro" de rota no NestJS.
// AuthGuard('jwt'): usa a JwtStrategy registrada para verificar o token.
// Se o token for inválido ou ausente, retorna 401 Unauthorized automaticamente.
// Uso: @UseGuards(JwtAuthGuard) em cima de um controller ou método.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
