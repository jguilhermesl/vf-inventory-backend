## Vf Inventory

### RFs (Requisitos Funcionais)

- [x] Deve ser possível se autenticar;
- [x] Deve ser possível resgatar os dados de um usuário;
- [x] Deve ser possível criar um usuário;
- [x] Deve ser possível editar um usuário;
- [x] Deve ser possível deletar um usuário;
- [x] Deve ser possível resgatar os dados de todos os estoques;
- [x] Deve ser possível criar um estoque;
- [x] Deve ser possível editar um estoque;
- [x] Deve ser possível deletar um estoque;
- [x] Deve ser possível resgatar os dados de todos os produtos;
- [x] Deve ser possível criar um produto;
- [x] Deve ser possível editar um produto;
- [x] Deve ser possível deletar um produto;
- [x] Deve ser possível dar baixa no estoque;
- [x] Deve ser possível pesquisar um produto;;
- [x] Deve ser possível pesquisar um estoque;
- [x] Deve ser possível resgatar um histórico completo das últimas entradas/saídas do estoque;
- [x] Deve ser possível imprimir os dados da tabela em um arquivo CSV ou PDF.

### RNs (Regras de Negócio)

- [x] Não deve ser possível criar um membro com um email já existente no banco;
- [x] Apenas administradores podem cadastrar um usuário;
- [x] Data e hora devem ser armazenadas ao criar um estoque;
- [x] Um registro deve ser criado a cada saída/entrada de estoque;

### RFNs (Requisitos Não Funcionais)

- [x] Os dados da aplicação devem persistir em um banco de dados PostgreSQL.
- [x] A senha será validada por JWT.
- [x] O usuário não pode chamar endpoints do sistema sem uma devida credencial. Exceto o endpoint de login.
