import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { LeadStatus } from './enums/lead.status.enum';

@Injectable()
export class LeadsService {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  async create(createLeadDto: CreateLeadDto, userId: string): Promise<Lead> {
    // Verifica email duplicado por usuário
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const existing = await this.leadRepository.findOne({
      where: { email: createLeadDto.email, userId },
    });
    if (existing) {
      throw new ConflictException('Já existe um lead com este e-mail');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const lead = this.leadRepository.create({
      ...createLeadDto,
      userId,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.leadRepository.save(lead);
  }

  // findAll: retorna todos os leads do usuário logado.
  // Aceita filtro opcional de status — útil para o frontend filtrar uma coluna só.
  async findAll(userId: string, status?: LeadStatus): Promise<Lead[]> {
    const where: any = { userId };
    if (status) where.status = status;

    return this.leadRepository.find({
      where,
      // order: leads mais recentes primeiro.
      order: { createdAt: 'DESC' },
    });
  }

  // findAllGrouped: retorna leads agrupados por status — ideal para montar o Kanban
  // sem precisar de múltiplas chamadas do frontend (uma por coluna).
  async findAllGrouped(userId: string): Promise<Record<LeadStatus, Lead[]>> {
    const leads = await this.leadRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // Inicializa o objeto com arrays vazios para cada status.
    // Assim o frontend sempre recebe todas as colunas, mesmo sem leads.
    const grouped = Object.values(LeadStatus).reduce(
      (acc, status) => {
        acc[status] = [];
        return acc;
      },
      {} as Record<LeadStatus, Lead[]>,
    );

    // Distribui cada lead na sua coluna correspondente.
    leads.forEach((lead) => {
      grouped[lead.status].push(lead);
    });

    return grouped;
  }

  async findOne(id: string, userId: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({ where: { id } });

    if (!lead) throw new NotFoundException('Lead não encontrado');

    // Segurança: um usuário só pode ver os próprios leads.
    if (lead.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return lead;
  }

  async update(
    id: string,
    updateLeadDto: UpdateLeadDto,
    userId: string,
  ): Promise<Lead> {
    const lead = await this.findOne(id, userId);

    // Object.assign: mescla os novos dados no objeto existente.
    // Só altera os campos que vieram no DTO (os outros ficam como estão).
    Object.assign(lead, updateLeadDto);
    return this.leadRepository.save(lead);
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateLeadStatusDto,
    userId: string,
  ): Promise<Lead> {
    const lead = await this.findOne(id, userId);
    lead.status = updateStatusDto.status;
    return this.leadRepository.save(lead);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const lead = await this.findOne(id, userId);
    await this.leadRepository.remove(lead);
    return { message: 'Lead removido com sucesso' };
  }

  // getStats: resumo numérico por status — para um dashboard simples no frontend.
  async getStats(userId: string): Promise<Record<string, number>> {
    const leads = await this.leadRepository.find({ where: { userId } });

    const stats = Object.values(LeadStatus).reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {} as Record<string, number>,
    );

    leads.forEach((lead) => {
      stats[lead.status]++;
    });

    stats['total'] = leads.length;
    return stats;
  }
}
