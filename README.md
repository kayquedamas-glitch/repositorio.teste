# Synapse PRO - Centro de Comando Operacional

Sistema de alta performance mental com gamificação militar, IA tática e controle neuroquímico.

## 🎯 Visão Geral

Synapse PRO é uma Progressive Web App (PWA) de produtividade que combina gamificação estilo militar com IA para combater a procrastinação. O sistema inclui:

- **QG Operacional**: Dashboard com missões, XP e sistema de patentes militares
- **IA Comandante**: Chat com múltiplas personas (Comandante, Diagnóstico, Pânico)
- **Modo Foco**: Pomodoro em fullscreen com recompensas XP
- **Protocolo Pânico**: Exercício de respiração guiado para ansiedade
- **Gamificação**: Sistema completo de níveis, patentes e estatísticas

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Autenticação**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **Tipografia**: Geist & Geist Mono
- **Deployment**: Vercel

## 🛠️ Setup Local

### 1. Clonar o Repositório

\`\`\`bash
git clone <seu-repo>
cd synapse-pro
\`\`\`

### 2. Instalar Dependências

\`\`\`bash
npm install
# ou
pnpm install
# ou
yarn install
\`\`\`

### 3. Configurar Variáveis de Ambiente

As variáveis já estão configuradas no projeto Vercel. Para desenvolvimento local, você precisará de:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### 4. Executar Scripts do Banco de Dados

Os scripts SQL estão em `scripts/`. Execute-os na ordem:

1. `001_create_profiles.sql` - Tabela de perfis de usuário
2. `002_create_missions.sql` - Tabela de missões/tarefas
3. `003_create_chat_messages.sql` - Histórico de chat
4. `004_create_focus_sessions.sql` - Sessões de foco
5. `005_create_panic_logs.sql` - Logs de protocolo pânico
6. `006_create_functions.sql` - Funções auxiliares

**Importante**: Os scripts podem ser executados diretamente pela interface v0, sem necessidade de acessar o dashboard do Supabase.

### 5. Iniciar Servidor de Desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

Acesse: `http://localhost:3000`

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

- **profiles**: Dados do usuário (rank, level, xp)
- **missions**: Tarefas/missões com prioridade e recompensa XP
- **chat_messages**: Histórico de conversas com IA
- **focus_sessions**: Registro de sessões Pomodoro
- **panic_logs**: Logs de uso do protocolo de pânico

### Sistema de Patentes

| Patente | Nível Mínimo | Icon |
|---------|--------------|------|
| Recruta | 1 | ⚊ |
| Soldado | 5 | ⚌ |
| Sargento | 10 | ≡ |
| Tenente | 20 | ⬒ |
| Capitão | 35 | ◈ |
| Comandante | 50 | ⬢ |
| General | 75 | ✦ |
| Lenda | 100 | ★ |

## 🎨 Design System

### Paleta de Cores

- **Background**: `#050505` (Quase preto absoluto)
- **Cards**: `#0a0a0a` com bordas `#222`
- **Acento Principal**: `#CC0000` (Vermelho brutal)
- **Sucesso**: Verde militar
- **Texto**: Branco e cinzas

### Tipografia

- **UI**: Geist (font-sans)
- **Código/Terminal**: Geist Mono (font-mono)

## 🎮 Funcionalidades

### Dashboard QG Operacional

- Visualização de missões ativas e completas
- Cards de estatísticas (Nível, Patente, Taxa de Conclusão)
- Adicionar missões com prioridades (Baixa, Normal, Alta, Crítica)
- Filtros por status
- Sistema de XP e progressão automática

### Chat IA

**3 Personas:**

1. **Comandante**: Direto, militar, focado em execução
2. **Diagnóstico**: Analítico, identifica sabotadores mentais
3. **Pânico**: Suporte emergencial para ansiedade

**Comandos Especiais:**
- `add: [tarefa]` - Cria missão automaticamente

### Modo Foco

- Timer Pomodoro (15, 25, 45, 60 min)
- Modo fullscreen automático
- Recompensa XP proporcional ao tempo
- "Abortar Missão" para saída antecipada

### Protocolo Pânico

- Exercício de respiração 4-4-4
- Animação visual com círculo expansivo
- Contagem regressiva guiada
- Registro de uso no banco de dados

## 🔐 Segurança

- **Row Level Security (RLS)** em todas as tabelas
- Autenticação via Supabase Auth
- Middleware para proteção de rotas
- Validação de sessão em cada requisição

## 📱 PWA (Progressive Web App)

O app é totalmente responsivo e funciona como PWA:

- Instalável no dispositivo
- Funciona offline (após primeiro carregamento)
- Notificações push (futuro)
- Interface mobile otimizada com bottom navigation

## 🚀 Deploy

O projeto já está configurado para deploy na Vercel:

1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente do Supabase
3. Deploy automático em cada push

## 📈 Próximas Features

- [ ] Integração com IA real (GPT-4, Claude)
- [ ] Notificações push para lembretes
- [ ] Calendário tático com heatmap
- [ ] Modo offline completo
- [ ] Suporte para equipes/squads
- [ ] Integração com Notion/Google Calendar
- [ ] Histórico de streak (dias consecutivos)
- [ ] Achievements/Badges especiais

## 🤝 Contribuindo

Este é um projeto pessoal, mas contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - sinta-se livre para usar como quiser.

## 🙏 Agradecimentos

- Design inspirado em interfaces militares/HUD
- Construído com v0 by Vercel
- Supabase pela infraestrutura backend

---

**SISTEMA OPERACIONAL** ✓
