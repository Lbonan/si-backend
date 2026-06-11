import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LeadStatus } from '../enums/lead.status.enum';
import { User } from '../../users/entities/user.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name?: string;

  @Column({ unique: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  // type: 'enum' diz ao TypeORM pra criar a coluna como ENUM no PostgreSQL.
  // default: todo lead começa como 'novo'.
  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NOVO,
  })
  status!: LeadStatus;

  // Interesse do lead: tipo de imóvel que procura
  @Column({ nullable: true })
  interest?: string;

  // Orçamento do lead
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  budget?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Relação ManyToOne: muitos leads pertencem a um usuário.
  // eager: false = o TypeORM NÃO carrega o usuário automaticamente (evita N+1 queries).
  // onDelete: 'CASCADE' = se deletar o usuário, os leads dele são deletados também.
  @ManyToOne(() => User, (user) => user.leads, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: User;

  // Coluna userId separada para buscar leads por usuário sem JOIN desnecessário.
  @Column()
  userId?: string;
}
