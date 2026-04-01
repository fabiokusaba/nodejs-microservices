# Curso Microsserviços Escaláveis - Rocketseat

## Conceito

- Microsserviços não são arquitetura de código, não é a maneira que você escreve o seu código.
- Microsserviço é uma arquitetura de infraestrutura, ou seja, é a maneira que você distribui o seu código, a maneira que
  você entrega o seu código para produção.
- A definição de microsserviços é que eles são serviços independentemente implantáveis. Isso quer dizer que é uma forma que
  temos de distribuir a nossa aplicação em vários projetos menores onde cada uma é independente das outras partes na hora da
  gente implantar (deploy, escalar).
- Microsserviços são modelados em torno de um domínio de negócio específico.
- DDD (Domain Driven Design) -> é a maneira de desenharmos software a partir do domínio.
- Bounded Contexts - dentro do DDD temos essa nomenclatura que basicamente é a forma de separarmos o nosso software da
  maneira que a gente separa os setores da nossa empresa e com isso navegamos em uma diferente comunicação entre esses setores.
- Linguagem Ubíqua/Negócio -> basicamente são os termos que são utilizados pelos stakeholders (pessoas de negócio) na hora de
  se referir aos problemas.
- O maior erro que cometemos ao construir microsserviços é separá-los por módulos, o correto é separá-los por setor, por área
  comum de conhecimento.

## Vantagens

- Infraestrutura específica por necessidade de serviço.
- Escalabilidade direcionada.
- Desenvolvimento paralelo em equipes muito grandes.

## Desafios

- A partir do momento que você para de manter um software e você começa a manter dez, vinte softwares você tem a complexidade
  distribuída. A complexidade da comunicação entre serviços distribuída.
- Overhead operacional -> tudo o que você fazia com o monolito você precisa fazer dez vezes, fluxos de CI/CD, monitoramento,
  debug, lidar com banco de dados, backups.
- Replicação de dados entre diversos serviços.
- Consistência de dados.

## Glossário

- Message Broker -> sistema de mensageria assíncrona resolve o problema de como que eu faço a comunicação de serviços sem
  depender de chamadas REST que são síncronas, sucetíveis a latência, sucetíveis ao sistema estar fora do ar. (RabbitMQ/Kafka)
- Requisição HTTP -> depende que o outro serviço esteja no ar para que a operação seja finalizada.
- gRPC -> mesma lógica que HTTP, dependo que o outro serviço esteja disponível.
- Async -> um serviço não se comunica direto com o outro, ele vai emitir um evento (order_created) dentro do message broker com
  os dados necessários e o outro serviço vai até o message broker buscar as mensagens (eventos) para processá-los.
- API Gateway -> nada mais é do que uma aplicação que vive entre os teus serviços e o teu frontend que centraliza todos os
  endpoints, todas as rotas da sua aplicação em um único local. Direciona as chamadas para os serviços que você tem na sua aplicação.
- Distributed Tracing -> quando um usuário faz um pedido dentro do nosso serviço de 'Orders' ao emitirmos o evento criamos um id único
  daquela requisição (traceId) e envio esse id com todas as mensagens que são trafegadas no meu serviço e se essa mensagem foi enviada
  para um outro serviço ela vai caminhando junto levando o traceId, por isso quando o meu serviço 'Invoices' fizer a emissão da NFe
  eu vou ter o meu traceId aqui junto e aí toda vez que eu for emitir para o meu sistema de monitoramento/observabilidade eu envio esse
  traceId junto com a minha requisição, isso faz com que quando eu chego no meu sistema de monitoramento e vejo que tem algo levando
  muito tempo eu consigo vê-lo por completo porque tenho um traceId que identifica a requisição de uma forma individual desde que ela
  chegou no serviço de 'Orders' até quando ela chegou no serviço de 'Invoices'. É uma maneira da gente saber o que está levando mais
  tempo desde quando o usuário fez a primeira operação que bateu em um serviço até chegar em dez serviços depois.
- Idepotência -> como evitar que uma operação se repita caso algo falhe durante uma execução assíncrona dentro de um serviço? Através
  da idepotência. É a forma de evitar que uma operação seja executada mais de uma vez caso algo falhe e precise ser reprocessado.
- SAGA Pattern -> transações que contemplam múltiplos serviços devem ser quebradas em micro transações.
- Circuit Breaker -> é como se fosse um proxy que detecta quando operações que estão sendo feitas em um serviço estão lentas, um serviço
  está sobrecarregado, falhando por algo externo, e ele começa a falhar isso de forma mais rápida.
- BFF (Backend For Frontend) -> serve como se fosse uma ponte que busca dados entre vários serviços e combina numa única chamada HTTP.
  O uso do GraphQL nesse ponto se torna uma grande vantagem.

###

- Toda vez que a gente cria uma aplicação que ela vai ter um escalonamento horizontal ou que ela vai ter uma estratégia de deploy que a
  gente chama de Blue-green deployment ela precisa de uma rota de health check. Essa rota basicamente vai verificar se a nossa aplicação
  está funcionando.
- Escalonamento horizontal -> se eu tiver muitos acessos ele vai começar a criar novas máquinas (servidores) da minha aplicação e daí
  para que ele possa entender que esses servidores podem começar a receber tráfego, que o load balancer pode começar a enviar tráfego para
  dentro dessas máquinas ele fica executando a nossa rota de health check e se ela retornar 'OK' quer dizer que está disponível a receber
  chamadas.
- Blue-green deployment -> imagina que você tem a versão 1 da tua aplicação funcionando no ar e daí você vai lá e faz o deploy da versão 2
  só que você não pode matar a sua aplicação da versão 1 para depois subir a aplicação da versão 2 porque isso vai gerar um delay que pode
  impactar quem está usando o serviço naquele momento, então ela vai ficar batendo na rota de health check até essa nova versão 2 estiver
  operável e aí ele começa a mandar o tráfego da versão 1 para a versão 2 e depois ele mata a versão 1.
- Volume dentro do Docker é a forma de adicionarmos estado na nossa aplicação, ou seja, quando eu matar o meu container e subir ele denovo
  ele vai manter os arquivos que ele tinha antes, só que isso acaba sendo um problema porque quando queremos escalar a nossa aplicação de
  forma horizontal para isso ser possível as aplicações precisam ser STATELESS, ou seja, não guardar nada em disco, deve ser possível eu
  matar a minha aplicação e subir ela devolta e ela funcionar exatamente da mesma forma, por isso todo estado que a gente tiver na nossa
  aplicação (sessão do usuário, arquivo) sempre armazenado fora do disco rígido.
- O RabbitMQ tem duas formas da gente segregar as mensagens: as filas e as exchanges.
- Contratos são o ponto de verdade entre todos os serviços de quais dados estão trafegando entre os microsserviços.
- O microsserviço sempre fala "Eu fiz isso", ele não está nem aí para o que vai acontecer mais pra frente, então ele dispara eventos que
aconteceram nele mesmo, o que os outros serviços vão fazer com esse evento tanto faz, não é de responsabilidade desse serviço.
- Padrão Publish/Subscribe: você publica mensagens no RabbitMQ, a partir desse momento o RabbitMQ guarda essa mensagem em um banco de dados
depois em algum momento a minha aplicação que deve receber essas mensagens pode se inscrever para receber essas mensagens, e aí ele vai lá
e pega todas as mensagens que estão dentro da minha fila.