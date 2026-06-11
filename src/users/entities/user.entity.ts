import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Lead } from '../../leads/entities/lead.entity';

// @Entity('users') diz ao TypeORM: "crie uma tabela chamada 'users' para esta classe".
@Entity('users')
export class User {
  // UUID como chave primária: mais seguro que inteiro incremental
  // (não expõe quantos usuários existem, mais difícil de adivinhar).
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  // @Exclude(): quando o NestJS serializar este objeto para JSON (na resposta HTTP),
  // o campo 'password' será removido automaticamente. Nunca retorna a senha pro cliente.
  @Exclude()
  @Column()
  password: string;

  // @CreateDateColumn e @UpdateDateColumn: preenchidos automaticamente pelo TypeORM.
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relação: um User tem muitos Leads.
  // { cascade: true } = ao deletar um usuário, seus leads são deletados junto.
  @OneToMany(() => Lead, (lead) => lead.user, { cascade: true })
  leads: Lead[];
}
