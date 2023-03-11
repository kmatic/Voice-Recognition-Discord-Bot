FROM node:18.15-alpine as build
WORKDIR /usr/src/app
COPY ["package*.json", "yarn.lock", "./"]
RUN yarn install
COPY . .
RUN yarn run build

FROM node:18.15-alpine as production
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package*.json", "yarn.lock", "./"]
RUN yarn install --production --frozen-lockfile
COPY --from=build /usr/src/app/dist ./dist
RUN chown -R node /usr/src/app
USER node
CMD ["node", "dist/index.js"]
