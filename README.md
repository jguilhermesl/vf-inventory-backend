## Vf Inventory

### RFs (Requisitos Funcionais)

- [x] Deve ser possível se autenticar;
- [ ] Deve ser possível resgatar os dados de um usuário;
- [x] Deve ser possível criar um usuário;
- [x] Deve ser possível editar um usuário;
- [x] Deve ser possível deletar um usuário;
- [ ] Deve ser possível resgatar os dados de todos os estoques;
- [ ] Deve ser possível criar um estoque;
- [ ] Deve ser possível editar um estoque;
- [ ] Deve ser possível deletar um estoque;
- [ ] Deve ser possível resgatar os dados de todos os produtos;
- [ ] Deve ser possível criar um produto;
- [ ] Deve ser possível editar um produto;
- [ ] Deve ser possível deletar um produto;
- [ ] Deve ser possível dar baixa no estoque;
- [ ] Deve ser possível pesquisar um produto;;
- [ ] Deve ser possível pesquisar um estoque;
- [ ] Deve ser possível resgatar um histórico completo das últimas entradas/saídas do estoque;
- [x] Deve ser possível imprimir os dados da tabela em um arquivo CSV ou PDF.

### RNs (Regras de Negócio)

- [x] Não deve ser possível criar um membro com um email já existente no banco;
- [ ] Apenas administradores podem cadastrar um usuário;
- [ ] Data e hora devem ser armazenadas ao criar um estoque;
- [ ] Um registro deve ser criado a cada saída/entrada de estoque;

### RFNs (Requisitos Não Funcionais)

- [x] Os dados da aplicação devem persistir em um banco de dados PostgreSQL.
- [x] A senha será validada por JWT.
- [ ] O usuário não pode chamar endpoints do sistema sem uma devida credencial. Exceto o endpoint de login.
