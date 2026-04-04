FROM node:20-alpine AS build

RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn config set nodeLinker node-modules

RUN yarn install

COPY . ./

RUN npx tsc --noEmit --skipLibCheck || true
RUN yarn build

FROM node:20-alpine AS production

WORKDIR /app

RUN yarn global add serve

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
