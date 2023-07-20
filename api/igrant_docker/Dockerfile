FROM node:alpine as build-stage

RUN mkdir -p /app/igrant_nest_api_app
WORKDIR /app/igrant_nest_api_app

COPY . .
RUN npm install

RUN npm run build igrant_api

