FROM node:22

WORKDIR /application-api

COPY . .

RUN yarn install

EXPOSE 3000

CMD bash -c "npx prisma db push && yarn start"