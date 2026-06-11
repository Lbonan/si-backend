import { PartialType } from '@nestjs/swagger';
import { CreateLeadDto } from './create-lead.dto';

// PartialType(CreateLeadDto): cria uma cópia do CreateLeadDto onde TODOS os
// campos são opcionais (equivalente a Partial<CreateLeadDto> no TypeScript puro).
// Isso evita duplicar as validações — reutiliza os mesmos decoradores do CreateLeadDto.
// Uso: PATCH /leads/:id com apenas os campos que quiser alterar.
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateLeadDto extends PartialType(CreateLeadDto) {}
