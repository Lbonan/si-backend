import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';

// @Module(): cada módulo é uma "caixa" que encapsula um contexto do sistema.
// imports: registra a entity User no TypeORM para este módulo.
// providers: classes que podem ser injetadas dentro deste módulo.
// exports: o que este módulo "compartilha" com outros módulos que o importarem.
//   -> AuthModule precisa do UsersService para verificar credenciais.
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
