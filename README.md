# 📋 Paster

Uma aplicação minimalista de clipboard compartilhado para facilitar cópia e cola entre diferentes dispositivos, sem necessidade de instalação de software adicional.

## 🎯 Objetivo

Resolver o problema de copiar e colar conteúdo entre diferentes computadores de forma simples, rápida e sem fricção. Basta acessar pelo navegador, autenticar e pronto - seu clipboard está sincronizado entre dispositivos.

## ✨ Características

- **Super Simples**: Interface limpa e intuitiva focada em produtividade
- **Leve**: Poucas dependências externas, apenas o essencial (Express.js + SQLite)
- **Self-Hosted**: Mantenha seus dados sob seu controle, hospede em sua própria infraestrutura
- **Zero Install**: Funciona diretamente no navegador, sem necessidade de instalar aplicativos
- **Persistência**: Dados salvos em banco SQLite, confiável e eficiente
- **Namespaces por Usuário**: Cada usuário tem seu próprio espaço de conteúdo
- **Drag & Drop**: Suporte a arrastar e soltar arquivos de texto
- **Tema Dark**: Interface moderna com tema escuro (exceto área de edição)
- **Word Wrap**: Opção para quebra automática de linha

## 🏗️ Arquitetura Técnica

### Stack

- **Backend**: Node.js + Express.js
- **Database**: SQLite3 (via better-sqlite3)
- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla
- **Autenticação**: HTTP Basic Auth
- **Ícones**: Lucide Icons (via CDN)

### Estrutura do Projeto

```
.
├── server/               # Backend
│   ├── index.js         # Servidor Express principal
│   ├── database.js      # Configuração e inicialização do SQLite
│   ├── setup.js         # Script de setup do banco
│   ├── middleware/
│   │   └── auth.js      # Middleware de autenticação
│   ├── models/
│   │   ├── user.js      # Model de usuários
│   │   └── content.js   # Model de conteúdos
│   └── routes/
│       └── api.js       # Rotas da API
├── public/              # Assets estáticos
│   ├── index.html       # Interface principal
│   ├── styles.css       # Estilos (tema dark)
│   └── app.js           # Lógica client-side
├── paster.db            # Banco SQLite (gitignored)
└── package.json         # Dependências e scripts
```

### Funcionalidades Implementadas

- ✅ Autenticação HTTP Basic com proteção contra timing attacks
- ✅ CRUD de conteúdo por namespace de usuário
- ✅ Persistência em SQLite com transações ACID
- ✅ Arquitetura modular (routes, models, middleware separados)
- ✅ Upload de arquivos via botão ou drag & drop (limite: 1MB)
- ✅ Copiar para clipboard
- ✅ Cache desabilitado via headers
- ✅ Validação de entrada e limite de tamanho de requisição
- ✅ Graceful shutdown com fechamento seguro do banco
- ✅ Hot reload com Nodemon (desenvolvimento)

## 🚀 Instalação e Uso

### Requisitos

- Node.js 18+ (compatível com ES Modules)

### Setup

1. Clone o repositório:
   ```sh
   git clone <repo-url>
   cd paster
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Configure os usuários criando `users.json` a partir do template:
   ```sh
   cp users.example.json users.json
   ```

   Edite `users.json` com seus usuários desejados:
   ```json
   {
     "seu_usuario": "sua_senha_forte",
     "outro_usuario": "outra_senha_forte"
   }
   ```

   **⚠️ IMPORTANTE**: `users.json` está no `.gitignore` e não será versionado. Mantenha suas credenciais seguras!

4. Execute o setup do banco de dados:
   ```sh
   npm run setup
   ```

   Isso criará o banco SQLite (`paster.db`) e populará com os usuários definidos em `users.json`.4. Inicie o servidor:
   ```sh
   npm start
   ```

5. Acesse no navegador:
   ```
   http://localhost:3000
   ```

O navegador solicitará usuário e senha (HTTP Basic Auth).

### Gerenciamento de Usuários

Para adicionar novos usuários após o setup inicial:

1. Edite `users.json` adicionando os novos usuários ao array
2. Execute novamente: `npm run setup` (usuários existentes serão ignorados, apenas os novos serão criados)

Ou conectar diretamente ao SQLite:
```sh
sqlite3 paster.db
INSERT INTO users (username, password) VALUES ('novousuario', 'senha');
```### Variáveis de Ambiente

- `PORT`: Porta do servidor (padrão: 3000)

## 🔒 Segurança

### Medidas Implementadas

- ✅ **Timing-safe password comparison**: Proteção contra timing attacks usando `crypto.timingSafeEqual()`
- ✅ **Request size limiting**: Limite de 1MB para prevenir DoS
- ✅ **Input validation**: Validação de tipo e tamanho de conteúdo
- ✅ **Credentials protection**: `users.js` não é versionado (gitignored)
- ✅ **Safe logging**: Logs não expõem conteúdo sensível

### ⚠️ Recomendações para Produção

**ATENÇÃO - MVP**: Esta é uma versão MVP com usuários hardcoded. Para ambientes de produção, implemente:

- **HTTPS obrigatório**: Nunca use HTTP Basic Auth sem TLS/SSL
- **Rate limiting**: Adicione proteção contra brute force (ex: express-rate-limit)
- **Helmet.js**: Headers de segurança HTTP adicionais
- **Autenticação robusta**: Migre para JWT, OAuth2, ou similar
- **Criptografia de dados**: Criptografe o arquivo JSON em repouso
- **Variáveis de ambiente**: Use `.env` para configurações sensíveis
- **Logs de auditoria**: Registre tentativas de acesso e modificações
- **Backup automatizado**: Proteja contra perda de dados

## 🛣️ Roadmap

Possíveis melhorias futuras:

- [ ] Sistema de autenticação dinâmico
- [ ] Suporte a múltiplos clipboards por usuário
- [ ] Histórico de conteúdos
- [ ] Suporte a imagens e arquivos binários
- [ ] API REST documentada (Swagger)
- [ ] Testes automatizados
- [ ] Docker compose para deploy facilitado
- [ ] Sincronização em tempo real (WebSockets)
- [ ] Criptografia end-to-end
- [ ] Modo de expiração automática de conteúdo

## 📝 API Endpoints

### `GET /api/content`
Retorna o conteúdo do usuário autenticado.

**Response:**
```json
{
  "username": "alice",
  "content": "texto salvo..."
}
```

### `POST /api/content`
Salva novo conteúdo para o usuário autenticado.

**Request:**
```json
{
  "content": "novo texto..."
}
```

**Response:**
- `200 OK`: Conteúdo salvo com sucesso
- `400 Bad Request`: Conteúdo inválido (não é string)
- `401 Unauthorized`: Falha na autenticação
- `413 Payload Too Large`: Conteúdo excede 1MB

## 🤝 Contribuindo

Este é um projeto MVP. Contribuições são bem-vindas! Ideias de melhorias:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - sinta-se livre para usar, modificar e distribuir.

---

**Nota**: Este é um MVP focado em simplicidade. Para uso em produção, implemente as melhorias de segurança recomendadas.
