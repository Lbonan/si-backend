import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

// @Injectable(): marca esta classe como um "provider" do NestJS.
// Isso permite que ela seja injetada em outros lugares via Injeção de Dependência.
@Injectable()
export class UsersService {
  // @InjectRepository(User): o NestJS injeta o repositório do TypeORM para a entity User.
  // O repositório é o "braço" que faz as queries no banco (find, save, delete, etc).
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verifica se e-mail já existe antes de tentar inserir.
    // Melhor dar um erro claro do que deixar o banco retornar uma constraint error genérica.
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    // bcrypt.hash(senha, saltRounds):
    // - Gera um "salt" aleatório (string extra misturada à senha antes de hashear).
    // - saltRounds=10: o algoritmo roda 2^10 = 1024 iterações. Lento o suficiente
    //   pra dificultar ataques de força bruta, rápido o suficiente pra não atrasar o login.
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }
}
