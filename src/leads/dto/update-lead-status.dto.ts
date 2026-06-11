import { IsEnum } from 'class-validator';
import { LeadStatus } from '../enums/lead.status.enum';

// DTO separado só para mudança de status.
// Usado na rota PATCH /leads/:id/status — o drag-and-drop do Kanban chama essa rota.
export class UpdateLeadStatusDto {
  @IsEnum(LeadStatus, { message: 'Status inválido' })
  status!: LeadStatus;
}
