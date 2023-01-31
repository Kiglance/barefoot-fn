FROM node:latest as build


WORKDIR /
RUN npm install --force --global yarn

COPY . .
# RUN npm install --global yarn
RUN yarn install
# RUN npm install --force
RUN npm run build

FROM nginx:alpine
COPY --from=build /build /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]