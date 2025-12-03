# Manual do Usuário - Paster

## O que é o Paster?

Paster é um sistema de clipboard compartilhado que permite você salvar e acessar textos de qualquer dispositivo através do navegador. Funciona como um bloco de notas online pessoal e privado, onde cada usuário tem seu próprio espaço isolado.

**Sincronização bidirecional**: Você pode editar e salvar de qualquer dispositivo. Todos os lugares onde o Paster estiver aberto podem enviar conteúdo, e basta recarregar a página em outro dispositivo para obter a versão mais recente. Não importa se você salva do celular, tablet ou computador - o último conteúdo enviado sempre estará disponível em todos os dispositivos.

## Funcionalidades Principais

### Tela Principal

#### Área de Texto
- Campo grande para digitar ou colar qualquer conteúdo de texto
- Suporta textos de qualquer tamanho
- Mantém formatação e quebras de linha

#### Botão Enviar
- Salva o conteúdo digitado no servidor
- O conteúdo fica disponível em qualquer dispositivo onde você fizer login
- Exibe mensagem de confirmação quando enviado com sucesso

#### Botão Copiar
- Copia todo o conteúdo da área de texto para a área de transferência do seu dispositivo
- Fica desabilitado quando não há texto para copiar
- Útil para transferir rapidamente o texto para outro aplicativo

#### Botão Carregar Arquivo
- Permite carregar um arquivo de texto do seu computador
- O conteúdo do arquivo aparece na área de texto
- Limite máximo de 1MB por arquivo
- Aceita arquivos de texto (.txt, .md, .json, etc)

#### Quebra de Linha
- Checkbox que ativa/desativa quebra automática de linha
- Quando ativada: linhas longas quebram automaticamente na tela
- Quando desativada: linhas longas criam rolagem horizontal
- Sua preferência é salva e mantida entre sessões

#### Enviar Automaticamente
- Checkbox que ativa o envio automático do conteúdo
- Quando ativada: cada alteração no texto é automaticamente salva após 1 segundo sem digitar
- Quando desativada: você precisa clicar em "Enviar" manualmente para salvar
- Sua preferência é salva e mantida entre sessões
- Ideal para quem quer garantir que nada será perdido

#### Arrastar e Soltar
- Você pode arrastar um arquivo de texto direto para a área de texto
- O conteúdo do arquivo será carregado automaticamente
- Mesmo limite de 1MB

### Painel de Administração

Visível apenas para usuários com permissão de administrador.

#### Botão Administrar
- Aparece no canto superior direito para administradores
- Abre o painel de gerenciamento de usuários

#### Lista de Usuários
- Exibe todos os usuários cadastrados no sistema
- Mostra informações: ID, username, tipo (Usuário ou Administrador), data de criação, último login e última atualização de conteúdo
- Possibilita editar ou excluir cada usuário

#### Criar Novo Usuário
- Botão para adicionar novos usuários ao sistema
- Campos necessários:
  - Username: nome de usuário único
  - Senha: senha do usuário
  - Checkbox Administrador: define se o usuário terá permissões de administração

#### Editar Usuário
- Clique no ícone de editar (lápis) ao lado de cada usuário
- Permite alterar a senha do usuário
- Permite alterar o tipo (usuário comum ou administrador)
- O username não pode ser alterado

#### Excluir Usuário
- Clique no ícone de deletar (lixeira) ao lado de cada usuário
- Confirmação será solicitada antes de excluir
- Você não pode excluir seu próprio usuário

## Como Usar no Dia a Dia

### Trabalhar com Múltiplos Dispositivos

1. Abra o Paster em quantos dispositivos quiser (computador, celular, tablet)
2. Edite e salve de qualquer um deles - todos podem enviar conteúdo
3. Em outro dispositivo, recarregue a página (F5 ou puxe para atualizar no celular)
4. O último conteúdo enviado estará disponível
5. Funciona em qualquer direção: celular → computador, computador → celular, tablet → qualquer outro

### Salvar Nota Rápida

1. Digite ou cole seu texto
2. Ative "Enviar Automaticamente" para não precisar se preocupar em salvar
3. Seu conteúdo fica sempre atualizado e acessível

### Carregar Conteúdo de Arquivo

1. Clique em "Carregar Arquivo" ou arraste o arquivo para a área de texto
2. O conteúdo do arquivo aparece na tela
3. Clique em "Enviar" para salvar no servidor

### Copiar para Outro Aplicativo

1. Com o texto já carregado na área de texto
2. Clique em "Copiar"
3. Cole (Ctrl+V ou Cmd+V) em qualquer outro aplicativo

## Segurança e Privacidade

- Cada usuário tem acesso apenas ao seu próprio conteúdo
- As senhas são armazenadas de forma segura (criptografadas)
- O acesso requer autenticação (usuário e senha)
- Administradores não conseguem ver o conteúdo de outros usuários, apenas gerenciar as contas

## Dicas

- Use "Enviar Automaticamente" se trabalha com textos importantes e não quer perder alterações
- Desative "Quebra de Linha" se estiver trabalhando com código ou dados estruturados onde as quebras de linha são importantes
- O conteúdo é carregado automaticamente quando você acessa o sistema
- Sempre que fizer alterações importantes, aguarde a mensagem de confirmação "Enviado com sucesso!"
- Você pode ter o Paster aberto em vários dispositivos simultaneamente - qualquer um pode salvar
- Para ver as últimas alterações feitas em outro dispositivo, basta recarregar a página
- O sistema sempre mantém a última versão enviada, independente de qual dispositivo salvou
