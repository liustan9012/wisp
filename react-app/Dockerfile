FROM node:20-alpine AS build-stage


RUN npm i -g vite

WORKDIR /app/react-app/

COPY package.json package-lock.json /app/react-app/

RUN npm  install

COPY . /app/react-app/
RUN vite build

FROM nginx:alpine


COPY --from=build-stage /app/react-app/dist /usr/share/nginx/html


EXPOSE 8080

# Nginx
CMD ["nginx", "-g", "daemon off;"]
