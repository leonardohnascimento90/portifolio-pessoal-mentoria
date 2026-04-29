# 🔧 Tool Rental Management API (Node.js + Express)

API REST para gerenciamento de aluguel de ferramentas, com autenticação, controle de disponibilidade e reservas.

---

## 📌 Sobre o projeto

Esta API permite:

- Autenticação de usuários  
- Cadastro e consulta de ferramentas  
- Controle de status (disponível, indisponível, manutenção)  
- Criação e validação de reservas  
- Prevenção de conflitos de agendamento  

Projeto desenvolvido com foco em:

- Boas práticas REST  
- Testes automatizados  
- Testes de performance  
- Organização para portfólio profissional  

---

## 🚀 Tecnologias utilizadas

- Node.js  
- Express  
- Mocha  
- Chai  
- K6 (testes de performance)  

---

## 📂 Estrutura do projeto

```
.
├── controllers/
├── routes/
├── utils/
├── tests/
├── performance/
│   └── tool-rental-api-test.js
├── server.js
└── package.json
```

---

## ⚙️ Instalação

```
git clone https://github.com/leonardohnascimento90/portifolio-pessoal-mentoria.git
cd portifolio-pessoal-mentoria
npm install
```

---

## ▶️ Executando a aplicação

```
npm start
```

Servidor rodando em:

http://localhost:3000

---

## 🔐 Autenticação

### Login

POST /auth/login  

Body:

```
{
  "username": "admin",
  "password": "password"
}
```

Resposta:

```
{
  "autenticado": true,
  "token": "jwt_token"
}
```

---

## 🛠️ Endpoints principais

### 🔹 Ferramentas

| Método | Endpoint | Descrição |
|--------|--------|----------|
| GET | /tools | Lista todas |
| GET | /tools/:id | Busca por ID |
| POST | /tools | Cadastra ferramenta |
| PATCH | /tools/:id/status | Atualiza status |

---

### 🔹 Reservas

| Método | Endpoint | Descrição |
|--------|--------|----------|
| GET | /reservations | Lista reservas |
| POST | /reservations | Cria reserva |

---

## 🧪 Testes automatizados

Executar:

```
npm test
```

---

## 📊 Testes de Performance com K6

### ▶️ Executar testes

```
BASE_URL=http://localhost:3000 k6 run performance/tool-rental-api-test.js
```

---

## 📌 Repositório

https://github.com/leonardohnascimento90/portifolio-pessoal-mentoria

---

## 👨‍💻 Autor

Leonardo Nascimento
