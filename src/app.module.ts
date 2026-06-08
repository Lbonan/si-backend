import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [
    // ConfigModule: carrega o .env e disponibiliza via ConfigService em todo o app.
    // isGlobal: true = não precisa importar em cada módulo.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeOrmModule: conexão com PostgreSQL via variáveis do .env.
    // useFactory com ConfigService é a forma correta de usar variáveis de ambiente
    // em módulos assíncronos no NestJS.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        // autoLoadEntities: NestJS descobre as entities automaticamente
        // (cada módulo registra as suas via TypeOrmModule.forFeature).
        autoLoadEntities: true,
        // synchronize: em DEV, o TypeORM cria/atualiza as tabelas automaticamente.
        // NUNCA use true em produção — use migrations.
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
    }),

    AuthModule,
    UsersModule,
    LeadsModule,
  ],
})
export class AppModule {}
