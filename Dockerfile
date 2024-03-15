FROM node:latest as build

WORKDIR /
COPY . .
RUN npm install --force
RUN npm run build

FROM nginx:alpine
COPY --from=build /build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]