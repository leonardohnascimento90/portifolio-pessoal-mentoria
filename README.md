# 🔧 Tool Rental Management API (Node.js + Express)

API REST para gerenciamento de aluguel de ferramentas, com autenticação, controle de disponibilidade e reservas.

---

## 📌 Sobre o projeto

Esta API foi desenvolvida para simular um sistema de locação de ferramentas, permitindo:

* Autenticação de usuários
* Cadastro e consulta de ferramentas
* Controle de status (disponível, indisponível, manutenção)
* Criação e validação de reservas
* Prevenção de conflitos de agendamento

---

## 🚀 Tecnologias utilizadas

* Node.js
* Express
* Swagger (swagger-ui-express / swagger-jsdoc)
* Mocha + Chai (testes)
* JavaScript

---

## 🔗 Repositório

Acesse o código do projeto:

👉 https://github.com/leonardohnascimento90/portifolio-pessoal-mentoria

---

## ⚙️ Instalação

Clone o repositório:

```bash
git clone https://github.com/leonardohnascimento90/portifolio-pessoal-mentoria.git
cd portifolio-pessoal-mentoria
```

Instale as dependências:

```bash
npm install
```

---

## ▶️ Execução

```bash
npm start
```

A API estará disponível em:

```
http://localhost:3000
```

---

## 📚 Documentação (Swagger)

Acesse:

```
http://localhost:3000/api-docs
```

---

## 🔐 Autenticação

A API utiliza autenticação baseada em token.

### Login:

```http
POST /auth/login
```

```json
{
  "username": "admin",
  "password": "password"
}
```

Resposta:

```json
{
  "autenticado": true,
  "token": "JWT_TOKEN"
}
```

Use o token nas requisições:

```
Authorization: Bearer SEU_TOKEN
```

---

## 🧰 Endpoints principais

### 🔹 Ferramentas

* `GET /tools` → Lista ferramentas
* `GET /tools/:id` → Buscar por ID
* `POST /tools` → Criar ferramenta
* `PATCH /tools/:id/status` → Atualizar status

---

### 📅 Reservas

* `GET /reservations` → Lista reservas
* `POST /reservations` → Criar reserva
* `DELETE /reservations/:id` → Remover reserva

---

## 🧠 Regras de negócio

* Não permite reserva com data final menor que inicial
* Não permite conflito de reservas para a mesma ferramenta
* Não permite reservar ferramenta inexistente
* Apenas usuários autenticados acessam endpoints protegidos

---

## 🧪 Testes

Executar testes:

```bash
npm test
```

Cobertura inclui:

* Autenticação
* Ferramentas
* Reservas
* Validações e regras de negócio

---

## 📁 Estrutura do projeto

```
├── controllers
├── routes
├── tests
├── utils
├── server.js
```

---

## 🔒 Variáveis de ambiente

Opcional:

```
JWT_SECRET=seu_segredo
PORT=3000
```

---

## 📌 Melhorias futuras

* Integração com banco de dados (PostgreSQL/MongoDB)
* Cadastro de usuários
* Paginação e filtros
* Deploy (Render / Railway / AWS)
* Logs e monitoramento

---

## 👨‍💻 Autor

Desenvolvido por **Leonardo Nascimento**

---

## 📄 Licença

Este projeto está sob a licença MIT.
