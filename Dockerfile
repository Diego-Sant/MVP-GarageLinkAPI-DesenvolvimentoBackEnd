# Iniciar sua imagem com uma imagem base de Node - Start your image with a Node base image
FROM node:18-alpine

# O diretório /app deve agir como a aplicação principal - The /app directory should act as the main application
WORKDIR /app

# Copie o arquivo package.json e package-lock.json da aplicação - Copy the package.json and package-lock.json file
COPY package*.json ./

# Instalar as dependências - Install dependencies
RUN npm install

# Copia todos os arquivos do projeto para o diretório de trabalho no contêiner - Copies all project files to the working directory in the container
COPY . .

# Executa o prisma generate para inicializar o Prisma Client - Run prisma generate to initialize Prisma Client
RUN npx prisma generate

# Definir uma variável de ambiente - Set an environment variable
ENV NODE_ENV=production

# Expor a porta do servidor de desenvolvimento - Expose the development server port
EXPOSE 8080

# Iniciar o aplicativo em modo de desenvolvimento - Start the app in development mode
CMD ["node", "app.js"]