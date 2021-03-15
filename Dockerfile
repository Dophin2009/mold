FROM mhart/alpine-node:15 as build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . /app
RUN npm run ci


FROM nginx:1.19-alpine as runtime

COPY --from=build /app/dist /usr/share/nginx/html
