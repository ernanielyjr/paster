# Paster

Aplicação minimalista de clipboard compartilhado entre dispositivos via navegador.

## Características

- Interface web simples e direta
- Self-hosted com SQLite
- Cada usuário tem seu próprio conteúdo isolado
- Drag & drop de arquivos de texto (limite 1MB)
- Tema dark com word wrap opcional

## Stack

- **Backend**: Node.js + Express.js
- **Database**: SQLite3 (better-sqlite3)
- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla
- **Autenticação**: HTTP Basic Auth com bcryptjs
- **Ícones**: Lucide Icons

## Instalação e Uso

### Requisitos

Node.js 18+

### Setup

1. Instale as dependências:
   ```sh
   npm install
   ```

2. Configure os usuários:
   ```sh
   cp users.example.json users.json
   ```

   Edite `users.json` com seus usuários:
   ```json
   [
     {
       "username": "seu_usuario",
       "password": "sua_senha",
       "isAdmin": true
     }
   ]
   ```

3. Execute o setup do banco:
   ```sh
   npm run setup
   ```

4. Inicie o servidor:
   ```sh
   npm start
   ```

5. Acesse `http://localhost:3000` e autentique com as credenciais configuradas.

### Adicionar Usuários

Edite `users.json` e execute `npm run setup` novamente. Usuários existentes serão ignorados.

### Variável de Ambiente

`PORT` - Porta do servidor (padrão: 3000)

## Segurança

Medidas implementadas:

- Senhas hasheadas com bcryptjs
- Timing-safe password comparison
- Limite de 1MB nas requisições
- Validação de entrada
- No-cache headers
- Logs sem expor conteúdo sensível

Para produção, adicione:

- HTTPS obrigatório
- Rate limiting
- Helmet.js
- Sistema de autenticação mais robusto

## API

### GET /api/content

Retorna o conteúdo do usuário autenticado.

### POST /api/content

Salva conteúdo para o usuário autenticado.

Body: `{ "content": "texto..." }`

Status: 200 OK, 400 Bad Request, 401 Unauthorized, 413 Payload Too Large

## Licença

MIT
