FROM node:18

WORKDIR /app

COPY package.json ./

COPY tsconfig.json ./

COPY tsconfig.build.json ./

RUN npm install

COPY ./lib ./lib

COPY ./commands ./commands

COPY index.ts ./

RUN ls

RUN /app/node_modules/typescript/bin/tsc -p /app/tsconfig.build.json

CMD ["node", "./dist/index.js"]