FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN  npm install

# 5. ソースコードをコピー
COPY . .

RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]