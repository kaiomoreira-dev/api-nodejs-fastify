## Intro
* Aplicação básica para aprender como funciona os fundamentos de NodeJS utilizando o framework Fastify.

## Description
* É uma API REST utilizando com objeivo de registrar transações de diferentes usuário. Essa transações podem ter tipo diferentes como 'Debit' para desconto e 'Credit' para incremento dos montantes. Resultando em rotas que é possivel verificar resumo da conta e das transações feita para usuário diferente usando cookies.

## Requisitos Funcionais(RF)
* [x] O usuário deve poder criar uma conta;
* [x] O usuário deve poder obter um resumo da sua conta;
* [x] O usuário deve poder listar todas transações que já ocorreram;
* [x] O usuário deve poder visualizar uma transação única;

## Regras de Negócios(RN)
* [x] A transação pode do tipo crédito que somará ao valor total, ou débito que será * subtraído;
* [x] Deve ser possível identificar o usuário entre as requisições;
* [x] O usuário só pode visualizar transações que ele criou;

