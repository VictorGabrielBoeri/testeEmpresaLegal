# 🎯 FitScore - Sistema de Avaliação de Candidatos

Sistema completo de avaliação de candidatos com formulário inteligente e dashboard administrativo para processos seletivos.

## 📋 Sobre o Projeto

O FitScore é uma plataforma moderna de avaliação de candidatos que permite:

- **Formulário de Avaliação**: Interface intuitiva para candidatos responderem questionários estruturados
- **Dashboard Administrativo**: Painel completo para visualização e análise de resultados
- **Classificação Automática**: Sistema de pontuação que classifica candidatos automaticamente
- **Processamento Assíncrono**: Notificações automáticas e relatórios programados
- **Analytics em Tempo Real**: Insights inteligentes sobre o processo seletivo

## 🚀 Funcionalidades Principais

### 📝 Formulário de Avaliação
- **10 perguntas estruturadas** divididas em 3 blocos:
  - **Performance**: experiência, entregas, habilidades
  - **Energia**: disponibilidade, prazos, pressão
  - **Cultura**: valores da empresa
- Interface multi-etapas com validação em tempo real
- Cálculo automático do FitScore
- Feedback imediato para candidatos

### 📊 Classificações FitScore
- **Fit Altíssimo**: ≥ 80 pontos
- **Fit Aprovado**: 60-79 pontos
- **Fit Questionável**: 40-59 pontos
- **Fora do Perfil**: < 40 pontos

### 🎛️ Dashboard Administrativo
- Listagem completa de candidatos avaliados
- Filtros por classificação e busca por nome/email
- Estatísticas em tempo real
- Interface responsiva com estados de loading e erro
- Sistema de autenticação seguro

### 🔄 Processamento Assíncrono
- **Notificação de Resultado**: Envio automático após avaliação
- **Relatório de Aprovados**: Relatórios programados para gestores
- **Analytics Inteligentes**: Insights sobre tendências e padrões

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Deployment**: Vercel

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### 1. Clone o repositório
\`\`\`bash
git clone https://github.com/seu-usuario/fitscore.git
cd fitscore
\`\`\`

### 2. Instale as dependências
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` com as seguintes variáveis:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico

# URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# Cron
CRON_SECRET=seu_secret_para_cron
\`\`\`

### 4. Configure o banco de dados
Execute os scripts SQL na seguinte ordem no Supabase:

\`\`\`bash
# 1. Criar tabela de avaliações
scripts/001_create_evaluations_table.sql

# 2. Criar perfis de admin
scripts/002_create_admin_profiles.sql

# 3. Criar logs de notificação
scripts/003_create_notification_logs.sql

# 4. Atualizar tipos de notificação
scripts/004_update_notification_types.sql
\`\`\`

### 5. Execute o projeto
\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

Acesse `http://localhost:3000` para ver a aplicação.

## 📁 Estrutura do Projeto

\`\`\`
├── app/
│   ├── admin/              # Dashboard administrativo
│   ├── auth/               # Páginas de autenticação
│   ├── formulario/         # Formulário de avaliação
│   └── api/                # API Routes
├── components/
│   ├── ui/                 # Componentes base (shadcn/ui)
│   └── admin-dashboard.tsx # Dashboard principal
├── lib/
│   └── supabase/           # Configuração Supabase
├── scripts/                # Scripts SQL
└── README.md
\`\`\`

## 🎯 Como Usar

### Para Candidatos
1. Acesse a página inicial
2. Clique em "Iniciar Avaliação"
3. Preencha seus dados pessoais
4. Responda as 10 perguntas nos 3 blocos
5. Receba seu resultado FitScore imediatamente

### Para Administradores
1. Acesse `/auth/login` para fazer login
2. Crie uma conta administrativa se necessário
3. Acesse o dashboard em `/admin`
4. Visualize candidatos, aplique filtros e analise resultados
5. Use `/admin/analytics` para insights avançados

## 🔐 Segurança

- **Row Level Security (RLS)** habilitado em todas as tabelas
- **Autenticação** via Supabase Auth
- **Validação** de dados no frontend e backend
- **Proteção de rotas** administrativas

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas
O projeto é compatível com qualquer plataforma que suporte Next.js.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

Desenvolvido com ❤️ para otimizar processos seletivos
