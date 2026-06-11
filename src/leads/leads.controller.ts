import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { LeadStatus } from './enums/lead.status.enum';

// @UseGuards(JwtAuthGuard) no controller: protege TODAS as rotas deste controller.
// Não precisa repetir em cada método.
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  // POST /api/v1/leads
  @Post()
  create(@Body() createLeadDto: CreateLeadDto, @CurrentUser() user: User) {
    return this.leadsService.create(createLeadDto, user.id);
  }

  // GET /api/v1/leads
  // Aceita query param opcional: ?status=novo
  @Get()
  findAll(@CurrentUser() user: User, @Query('status') status?: LeadStatus) {
    return this.leadsService.findAll(user.id, status);
  }

  // GET /api/v1/leads/kanban
  // Retorna leads agrupados por status — endpoint dedicado para o Kanban.
  // IMPORTANTE: esta rota deve vir ANTES de /leads/:id para o NestJS
  // não interpretar "kanban" como um UUID.
  @Get('kanban')
  getKanban(@CurrentUser() user: User) {
    return this.leadsService.findAllGrouped(user.id);
  }

  // GET /api/v1/leads/stats
  @Get('stats')
  getStats(@CurrentUser() user: User) {
    return this.leadsService.getStats(user.id);
  }

  // GET /api/v1/leads/:id
  // ParseUUIDPipe: valida que o :id é um UUID válido antes de chegar no service.
  // Retorna 400 automaticamente se for inválido.
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.leadsService.findOne(id, user.id);
  }

  // PATCH /api/v1/leads/:id
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLeadDto: UpdateLeadDto,
    @CurrentUser() user: User,
  ) {
    return this.leadsService.update(id, updateLeadDto, user.id);
  }

  // PATCH /api/v1/leads/:id/status
  // Rota separada para mudança de status (ação do drag-and-drop do Kanban).
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateLeadStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.leadsService.updateStatus(id, updateStatusDto, user.id);
  }

  // DELETE /api/v1/leads/:id
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.leadsService.remove(id, user.id);
  }
}
