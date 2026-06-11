import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  MinLength,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LeadStatus } from '../enums/lead.status.enum';

export class CreateLeadDto {
  @IsString()
  @MinLength(2)
  name?: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // @IsOptional(): campo não obrigatório. Se não vier, fica undefined (vai usar o default).
  // @IsEnum(): valida que o valor é um dos definidos no enum LeadStatus.
  @IsOptional()
  @IsEnum(LeadStatus, { message: 'Status inválido' })
  status?: LeadStatus;

  @IsOptional()
  @IsString()
  interest?: string;

  // @Type(() => Number): o ValidationPipe com transform:true converte a string "1500"
  // para o número 1500 automaticamente quando vem do JSON.
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  budget?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
