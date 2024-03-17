FROM node:latest as build


WORKDIR /app
RUN npm install --force --global yarn

COPY . /app
# RUN npm install --global yarn
RUN yarn install

ENV REACT_APP_BACKEND_URL https://barefoot-bn.onrender.com/api/v1
RUN yarn build
# RUN npm install --force
# RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx-default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# CMD ["yarn", "prod"]