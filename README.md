<p align="center">
  <a href="https://fastify.dev/" target="blank"><img src="https://fastify.dev/img/logos/fastify-white.png" width="400" alt="Fastify Logo" /></a>
</p>


## Intro
* Aplicação básica para aprender como funciona os fundamentos de NodeJS utilizando o framework Fastify.

## Description
* É uma API REST com objeivo de registrar transações de diferentes usuário. Essa transações podem ter tipo diferentes como 'Debit' para desconto e 'Credit' para incremento do montante. Resultando em rotas que é possivel verificar resumo da conta e das transações feita para usuário diferente usando cookies. A persistencia dos dados está sendo feita no SQLite3 usando o queryBuilder Knex.

## Requisitos Funcionais(RF)
* [x] O usuário deve poder criar uma conta;
* [x] O usuário deve poder obter um resumo da sua conta;
* [x] O usuário deve poder listar todas transações que já ocorreram;
* [x] O usuário deve poder visualizar uma transação única;

## Regras de Negócios(RN)
* [x] A transação pode do tipo crédito que somará ao valor total, ou débito que será * subtraído;
* [x] Deve ser possível identificar o usuário entre as requisições;
* [x] O usuário só pode visualizar transações que ele criou;

## Running the app

```bash
# development mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```

## Fix code
```bash
# fix code with eslint
$ npm run lint
```

## Build
```bash
# build project for JS
$ npm run build
```

# Owner
[<img src="https://avatars.githubusercontent.com/u/56137536?s=400&u=a74073f1d0f605815a4f343436c791ab7b7dc184&v=4" width=115><br><sub>Kaio Moreira</sub>](https://github.com/kaiomoreira-dev)
