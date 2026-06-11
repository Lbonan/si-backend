import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

// Decorator de parâmetro customizado.
// Depois do JwtAuthGuard validar o token, o Passport coloca o usuário em req.user.
// Este decorator extrai req.user de forma limpa, sem precisar injetar Request manual.
//
// Uso no controller:
//   @Get('profile')
//   @UseGuards(JwtAuthGuard)
//   getProfile(@CurrentUser() user: User) { ... }
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return request.user;
  },
);
