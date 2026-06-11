import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

// DTO (Data Transfer Object): classe que define o "contrato" dos dados que chegam
// na requisição. O ValidationPipe (configurado no main.ts) usa os decoradores
// do class-validator para validar automaticamente antes de chegar no controller.
export class CreateUserDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;
}
