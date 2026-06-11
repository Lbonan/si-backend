// Enum: define os valores possíveis para o status de um lead.
// Usar enum ao invés de string livre garante:
// 1. Validação no TypeScript em tempo de compilação.
// 2. O PostgreSQL armazena como texto mas só aceita esses valores.
// 3. O frontend sabe exatamente quais colunas o Kanban vai ter.
export enum LeadStatus {
  NOVO = 'novo', // Acabou de entrar no sistema
  CONTATO_FEITO = 'contato_feito', // Já foi contatado
  VISITA_AGENDADA = 'visita_agendada', // Visita ao imóvel marcada
  PROPOSTA_ENVIADA = 'proposta_enviada', // Proposta formal enviada
  FECHADO = 'fechado', // Negócio fechado ✓
  PERDIDO = 'perdido', // Lead não converteu
}
