# Paster

Sistema self-hosted de clipboard compartilhado com sincronização bidirecional entre dispositivos.

## Arquitetura Técnica

### Stack

- **Runtime**: Node.js 18+ com ES Modules
- **Framework**: Express.js 4.18.2
- **Database**: SQLite com better-sqlite3 12.5.0
- **Autenticação**: HTTP Basic Auth + bcryptjs
- **Frontend**: HTML5 + CSS3 + JavaScript vanilla (sem build tools)
- **Ícones**: Lucide Icons via CDN

### Estrutura do Projeto

```
paster/
├── server/
│   ├── index.js              # Entry point do servidor Express
│   ├── database.js           # Configuração SQLite com ACID
│   ├── setup.js              # Script de inicialização
│   ├── middleware/
│   │   ├── auth.js           # HTTP Basic Auth middleware
│   │   ├── isAdmin.js        # Admin role middleware
│   │   └── noCache.js        # Cache control headers
│   ├── models/
│   │   ├── user.js           # CRUD de usuários
│   │   └── content.js        # CRUD de conteúdo
│   └── routes/
│       ├── api.js            # Endpoints de conteúdo
│       └── admin.js          # Endpoints administrativos
├── public/                   # Static files servidos pelo Express
│   ├── index.html/js/css     # Interface principal
│   ├── admin.html/js/css     # Painel administrativo
│   └── common.css            # Estilos compartilhados
└── paster.db                 # Banco SQLite (gitignored)
```

### Banco de Dados

Schema SQLite com constraints e índices:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin INTEGER DEFAULT 0,
  last_login_at DATETIME,
  created_at DATETIME DEFAULT (datetime('now', 'localtime')),
);

CREATE TABLE contents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content TEXT DEFAULT '',
  updated_at DATETIME DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_contents_user_id ON contents(user_id);
```

- Foreign keys habilitadas
- CASCADE delete para limpeza automática
- Índice em `user_id` para queries otimizadas
- Timestamps em horario local (localtime)

## Instalação e Configuração

### Requisitos

- Node.js 18+
- NPM ou Yarn
- Sistema operacional: Linux, macOS ou Windows

### Setup Inicial

1. Clone e instale dependências:
   ```sh
   git clone <repo>
   cd paster
   npm install
   ```

2. Inicialize o banco de dados:
   ```sh
   npm run setup
   ```

   Este comando:
   - Cria `paster.db` com schema completo
   - Se não existirem usuários, cria usuário padrão:
     - Username: `admin`
     - Senha: `admin`
     - Permissão: Administrador
   - Cria registro de conteúdo vazio para cada usuário

3. Inicie o servidor:
   ```sh
   npm start          # Produção
   npm run dev        # Desenvolvimento com nodemon
   ```

4. Acesse `http://localhost:3000` e autentique:
   - Primeiro acesso: use `admin` / `admin`
   - **IMPORTANTE**: Altere a senha padrão imediatamente no painel admin

### Variáveis de Ambiente

- `PORT` - Porta do servidor (default: 3000)
- `NODE_ENV` - Ambiente de execução

### Gerenciamento de Usuários

**Via interface web** (recomendado):
- Acesse `/admin.html` com usuário administrador
- CRUD completo de usuários via API REST
- Altere a senha padrão do admin no primeiro acesso

**Via API REST**:
- Use endpoints `/api/admin/users` (ver seção API REST abaixo)
- Requer autenticação com usuário admin

## Segurança

### Medidas Implementadas

- **Autenticação**: HTTP Basic Auth com bcryptjs (cost factor 10)
- **Timing-safe comparison**: Proteção contra timing attacks em verificação de senha
- **Request limits**: Body parser limitado a 1MB (proteção DoS)
- **Validação**: Type checking e sanitização de inputs
- **Cache control**: No-cache headers em todas respostas
- **Logging**: Logs sem expor senhas ou conteúdo sensível
- **Foreign keys**: Cascade delete para integridade referencial

### Recomendações para Produção

- **Alterar senha padrão**: Trocar senha do usuário admin imediatamente
- **HTTPS obrigatório**: Reverse proxy (nginx/Caddy) com TLS
- **Rate limiting**: Limitar requisições por IP/usuário
- **Helmet.js**: Security headers adicionais
- **CORS**: Configurar origens permitidas
- **Session management**: Considerar JWT ou sessions com Redis
- **Backup**: Automatizar backup do `paster.db`
- **Monitoring**: Logs estruturados + alertas
- **Process manager**: PM2 ou systemd para restart automático

## API REST

Todas rotas requerem HTTP Basic Auth.

### Content Endpoints

#### `GET /api/content`
Retorna conteúdo do usuário autenticado.

**Response**:
```json
{
  "username": "user",
  "content": "texto salvo",
  "isAdmin": true
}
```

#### `POST /api/content`
Salva conteúdo do usuário autenticado.

**Body**:
```json
{
  "content": "novo texto"
}
```

**Status**: 200 OK, 400 Bad Request, 401 Unauthorized, 413 Payload Too Large

### Admin Endpoints

Requerem `isAdmin: true`.

#### `GET /api/admin/users`
Lista todos usuários.

**Response**:
```json
[
  {
    "id": 1,
    "username": "admin",
    "is_admin": 1,
    "created_at": "2025-12-03 10:00:00",
    "last_login_at": "2025-12-03 12:00:00",
    "content_updated_at": "2025-12-03 15:30:00"
  }
]
```

#### `POST /api/admin/users`
Cria novo usuário.

**Body**:
```json
{
  "username": "newuser",
  "password": "senha",
  "isAdmin": false
}
```

**Status**: 201 Created, 409 Conflict (username duplicado)

#### `PUT /api/admin/users/:id`
Atualiza usuário existente.

**Body**:
```json
{
  "password": "nova_senha",  // Opcional
  "isAdmin": true
}
```

#### `DELETE /api/admin/users/:id`
Remove usuário (não pode deletar a si mesmo).

**Status**: 204 No Content, 400 Bad Request

## Padrões de Código

- **ES Modules**: `type: "module"` no package.json
- **No comments**: Código autoexplicativo
- **No emojis**: Console logs e UI em texto plano
- **Idioma**: Mensagens em português brasileiro
- **Error handling**: Try-catch com status HTTP apropriados
- **Separation of concerns**: Routes → Models → Database

## Desenvolvimento

### Scripts NPM

```sh
npm run setup    # Inicializa banco e usuários
npm start        # Produção
npm run dev      # Watch mode com nodemon
```

### Testing

Atualmente sem suite de testes. Para adicionar:

```sh
npm install --save-dev jest supertest
```

### Contribuindo

- Mantenha código limpo sem comentários
- Siga convenções ES Modules
- Mensagens de commit descritivas
- Teste localmente antes de commit

## Deployment

### Docker (exemplo)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run setup
EXPOSE 3000
CMD ["npm", "start"]
```

### Systemd Service

```ini
[Unit]
Description=Paster Service
After=network.target

[Service]
Type=simple
User=paster
WorkingDirectory=/opt/paster
ExecStart=/usr/bin/node server/index.js
Restart=always
Environment=NODE_ENV=production PORT=3000

[Install]
WantedBy=multi-user.target
```

## Documentação

- **README.md** (este arquivo): Documentação técnica
- **MANUAL.md**: Guia do usuário final com funcionalidades

## Licença

MIT
