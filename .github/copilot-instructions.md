# Instruções do Projeto - Paster

## Premissas Técnicas

### Stack Tecnológica
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18.2
- **Banco de Dados**: SQLite com better-sqlite3 12.5.0
- **Autenticação**: HTTP Basic Auth com bcrypt
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Módulos**: ES Modules (type: "module")

### Arquitetura
- Backend modular com separação de responsabilidades
- Estrutura MVC-like: routes, models, middleware
- SQLite com ACID transactions e foreign keys
- Frontend servido como static files

### Padrões de Código
- **Sem comentários**: Código deve ser autoexplicativo
- **Sem emojis**: Mensagens de console e UI em texto simples
- **Idioma**: Todas mensagens e UI em português brasileiro (pt-BR)
- **Consistência**: Usar convenções JavaScript/Node.js padrão

### Segurança
- Senhas hasheadas com bcrypt (custo 10)
- Limite de 1MB para requests (proteção DoS)
- Validação de tipo de conteúdo
- No-cache headers em todas respostas
- Usuário admin padrão criado automaticamente no primeiro setup
- Logs sem expor conteúdo sensível

### Estrutura do Projeto
```
paster/
├── server/
│   ├── index.js (main server)
│   ├── database.js (SQLite connection)
│   ├── setup.js (initialization + create tables)
│   ├── middleware/
│   │   ├── auth.js (Basic Auth)
│   │   ├── isAdmin.js (Admin check)
│   │   └── noCache.js (cache headers)
│   ├── models/
│   │   ├── user.js (user CRUD)
│   │   └── content.js (content CRUD)
│   └── routes/
│       ├── api.js (content endpoints)
│       └── admin.js (admin endpoints)
├── public/
│   ├── index.html/js/css
│   ├── admin.html/js/css
│   └── common.css
└── paster.db (gitignored)
```

### Banco de Dados
- **Tabela users**: id, username, password (hash), is_admin, created_at, last_login_at
- **Tabela contents**: id, user_id (FK), content, updated_at
- **Índice**: idx_contents_user_id para performance
- **Timezone**: Todos timestamps usam datetime('now', 'localtime')

### Inicialização
- `npm run setup` cria banco e verifica se existe usuário admin
- Se não houver nenhum usuário com is_admin=1, cria usuário padrão admin/admin
- Gerenciamento de usuários via interface web (/admin.html)

### Scripts NPM
- `npm run setup` - Cria banco e usuário admin padrão (se necessário)
- `npm start` - Inicia servidor (produção)
- `npm run dev` - Inicia com nodemon (desenvolvimento)

### Princípios
- **Minimalismo**: Mínimo de dependências externas
- **Self-hosting**: Fácil de implantar e manter
- **Simplicidade**: Configuração através de arquivos JSON
- **Segurança**: Defaults seguros, sem comprometer simplicidade

### API Endpoints
- `GET /api/content` - Retorna conteúdo do usuário autenticado
- `POST /api/content` - Salva conteúdo (body: { content: string })
- Autenticação obrigatória em todas rotas

### Features da Interface
- Dark theme (#1a1a1a background)
- Textarea com word wrap toggle
- Botões: Enviar, Copiar, Carregar Arquivo
- Drag & drop de arquivos (limite 1MB)
- Mensagens de feedback coloridas (sucesso/erro)
- Ícones Lucide via CDN

### Tratamento de Erros
- Validação de entrada antes de processar
- Status HTTP apropriados (400, 401, etc)
- Mensagens de erro descritivas em pt-BR
- Graceful shutdown (SIGINT/SIGTERM)

### Desenvolvimento
- Usar multi_replace_string_in_file para múltiplas edições
- Evitar criar arquivos desnecessários
- Manter código limpo e sem comentários
- Testar após mudanças estruturais

### Não Fazer
- ❌ Não adicionar comentários de código
- ❌ Não usar emojis em código ou mensagens
- ❌ Não expor senhas ou conteúdo sensível em logs
- ❌ Não versionar paster.db
- ❌ Não usar inglês em mensagens visíveis ao usuário
