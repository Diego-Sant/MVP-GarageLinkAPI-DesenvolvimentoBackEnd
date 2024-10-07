# Desenvolvimento Back-end Avançado (Back-end com NodeJs)
  &nbsp;

## GarageLink

O objetivo deste projeto é desenvolver um site de compra e venda de carros que facilite a comunicação direta entre vendedores e compradores. Inspirado em plataformas como OLX e Webmotors, o site não realiza transações, mas permite a interação entre usuários em nível global.
    &nbsp;

---
## Projeto Back-end com NodeJs e Prisma

Projeto feito com 5 arquivos com diversas rotas vinculadas.

As rotas utilizadas no projeto são: 

Sobre usuários:
* Rota de POST: `("/cadastrar")`
* Rota de POST: `("/entrar")`
* Rota de POST: `("/sair")`
* Rota de GET: `("/")`
* Rota de GET: `("/pesquisar/:id")`
* Rota de PUT: `("/:id")`
* Rota de DELETE: `("/:id")`
* Rota de GET: `("/postagens")`

Sobre as postagens:
* Rota de GET: `("/")`
* Rota de GET: `("/:id")`
* Rota de POST: `("/")`
* Rota de PUT: `("/:id")`
* Rota de DELETE: `("/:id")`

Sobre o chat:
* Rota de GET: `("/")`
* Rota de GET: `("/:id")`
* Rota de POST: `("/")`
* Rota de PUT: `("/mensagem/:id")`

Sobre a mensagem:
* Rota de POST: `("/:chatId")`
  &nbsp;

---
## Como inicializar

Primeiramente será necessário criar o arquivo `.env` dentro da raíz do projeto e copiar o `DATABASE_URL`, `JWT_SECRET_KEY` e `CLIENT_URL` que estarão juntos com o link do github na plataforma da Puc-Rio.

Depois abrir o aplicativo `Docker Desktop`. Também será necessário parar outras imagens/conteineres(exceto a imagem criada pelo front-end) pois além de ter um limite de espaço, a rota do localhost pode ser a mesma e acabar acontecendo um erro do aplicativo já estar aberto.

```
docker ps -a
```

```
docker stop (CONTAINER ID)
```

```
docker rm (CONTAINER ID)
```

Em seguida, usar os comandos de build e run padrões do Docker.

```
docker build -t garagelinkapi .
```

Após a instalação, será feita a inicialização do arquivo Docker.

```
docker run -d -p 8080:8080 --name garagelinkserver garagelinkapi
```

Desse jeito, o projeto será iniciado em `http://localhost:8080`. Caso entre no link e apareça essa mensagem `Cannot GET /`, significa que o server está funcionando perfeitamente.

Caso essa mensagem apareça: `Ports are not available: exposing port TCP 0.0.0.0:8080 -> 0.0.0.0:0: listen tcp 0.0.0.0:8080: bind: Only one usage of each socket address`, os arquivos para mudar o port do local host são: `Dockerfile` ao lado de EXPOSE, `app.js` em app.listen e no front-end em `apiRequest.js` no BaseURL dentro da pasta /src/lib/apiRequest.js.