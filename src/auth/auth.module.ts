import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    // UsersModule exporta UsersService, que AuthService usa para buscar usuários.
    UsersModule,

    // PassportModule: registra o Passport no módulo. defaultStrategy define qual
    // strategy usar quando @UseGuards(AuthGuard()) é chamado sem parâmetro.
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JwtModule.registerAsync: configuração assíncrona para usar variáveis do .env.
    // expiresIn: tempo de validade do token (ex: '7d' = 7 dias, '1h' = 1 hora).
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  // JwtStrategy precisa ser provider para o Passport registrá-la automaticamente.
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
