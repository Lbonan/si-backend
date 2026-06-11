'HEREDOC'

# SI Backend — API REST

Backend do sistema de gestão de leads imobiliários. Desenvolvido com **NestJS** + **PostgreSQL**.

## Tecnologias

| Tecnologia | Versão | Função                          |
| ---------- | ------ | ------------------------------- |
| Node.js    | 22.x   | Runtime JavaScript              |
| NestJS     | 11.x   | Framework backend               |
| TypeORM    | 0.3.x  | ORM (mapeamento banco ↔ objeto) |
| PostgreSQL | 16.x   | Banco de dados                  |
| JWT        | —      | Autenticação stateless          |
| bcrypt     | —      | Hash de senhas                  |
| Docker     | 24+    | Containerização                 |

## Pré-requisitos

- Node.js 18+ e npm
- Docker e Docker Compose **ou** PostgreSQL instalado localmente

## Executar em desenvolvimento

### 1. Clone e instale dependências

```bash
git clone <url-do-repo>
cd si-backend
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env se necessário (os valores padrão já funcionam com o Docker)
```

### 3. Suba o banco com Docker

```bash
docker compose -f docker-compose.dev.yml up -d
```

### 4. Inicie o servidor

```bash
npm run start:dev   # hot-reload ativo
```

API disponível em: `http://localhost:3001/api/v1`

---

## Executar com Docker Compose (produção local)

```bash
docker compose up --build
```

Sobe banco + backend juntos. API em `http://localhost:3001/api/v1`.

---

## Variáveis de ambiente

| Variável         | Padrão                | Descrição                       |
| ---------------- | --------------------- | ------------------------------- |
| `DB_HOST`        | localhost             | Host do PostgreSQL              |
| `DB_PORT`        | 5432                  | Porta do PostgreSQL             |
| `DB_USERNAME`    | postgres              | Usuário do banco                |
| `DB_PASSWORD`    | postgres              | Senha do banco                  |
| `DB_NAME`        | si_imobiliaria        | Nome do banco                   |
| `JWT_SECRET`     | —                     | Segredo para assinar tokens JWT |
| `JWT_EXPIRES_IN` | 7d                    | Validade do token               |
| `PORT`           | 3001                  | Porta da API                    |
| `AI_SERVICE_URL` | http://localhost:8000 | URL do microserviço Python      |

---

## Endpoints

### Autenticação

| Método | Rota                    | Descrição                | Auth? |
| ------ | ----------------------- | ------------------------ | ----- |
| POST   | `/api/v1/auth/register` | Cadastrar usuário        | Não   |
| POST   | `/api/v1/auth/login`    | Login                    | Não   |
| GET    | `/api/v1/auth/me`       | Perfil do usuário logado | Sim   |

### Leads

| Método | Rota                       | Descrição                            | Auth? |
| ------ | -------------------------- | ------------------------------------ | ----- |
| POST   | `/api/v1/leads`            | Criar lead                           | Sim   |
| GET    | `/api/v1/leads`            | Listar leads (aceita `?status=novo`) | Sim   |
| GET    | `/api/v1/leads/kanban`     | Leads agrupados por status           | Sim   |
| GET    | `/api/v1/leads/stats`      | Contagem por status                  | Sim   |
| GET    | `/api/v1/leads/:id`        | Buscar lead por ID                   | Sim   |
| PATCH  | `/api/v1/leads/:id`        | Atualizar lead                       | Sim   |
| PATCH  | `/api/v1/leads/:id/status` | Mover lead no Kanban                 | Sim   |
| DELETE | `/api/v1/leads/:id`        | Remover lead                         | Sim   |

> Rotas autenticadas: enviar header `Authorization: Bearer <token>`

## Status do Kanban

```
novo → contato_feito → visita_agendada → proposta_enviada → fechado
                                                           → perdido
```

## Integração com outros serviços

- **Frontend (Next.js):** consome esta API em `http://localhost:3001/api/v1`
- **Microserviço IA (FastAPI):** esta API proxy as chamadas de chat para `AI_SERVICE_URL`
  HEREDOC
  Saída
