# Aplicação
Esta é uma aplicação desenvolvida em typescript, com o query buider knex, e usa zod para controle de variáveis de ambiente.

É uma aplicação de controle de dieta, onde seu uso consiste no registro de refeições, podendo assim ter uma visualização mais facilitada da dieta, resgatando as métricas por usuário.


# RN

- É possível criar um usuário através da rota "users/create" token não é necessário.

- É possível obter todos os usuários através da rota "users/getAll".

- É possível realizar o login na rota "/" o token é gerado nesta rota.

- A refeição é criada na rota "/meals/create" passando os dados:
  - [] Nome
  - [] Descrição
  - [] Refeição dentro da dieta (Boolean)

- A refeição pode ser alterada na rota "/meals/alter" podendo ser alterados todos os dados acima.

- É possível obter todas as refeições de um usuário na rota "/meals/getAll" é necessário estar logado, pois o usuário é relacionado a suas refeições através do token.

- É possível obter somente uma refeição pela rota "/meals/:id", a refeição deve pertencer ao usuário logado.

- É possível obter as métricas de usuário na rota "/metrics/:id", os dados recebido são:
  - [] Quantidade de refeições registradas
  - [] Quantidade total de refeições dentro da dieta
  - [] Quantidade total de refeições fora da dieta
  - [] Melhor sequência de refeições dentro da dieta

- O usuário só pode visualizar e editar refeições criadas por ele.
