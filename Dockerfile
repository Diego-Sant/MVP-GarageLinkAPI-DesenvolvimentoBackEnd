# Usa a imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todos os arquivos do projeto para o diretório de trabalho no contêiner
COPY . .

# Expõe a porta que o app irá rodar
EXPOSE 3002

# Comando para rodar o app
CMD ["node", "app.js"]