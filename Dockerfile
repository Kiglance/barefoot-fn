FROM node:latest


WORKDIR /app
RUN npm install --force --global yarn

COPY . /app
# RUN npm install --global yarn
RUN yarn install
# RUN npm install --force
# RUN npm run build

# FROM nginx:alpine
# COPY --from=build /build /usr/share/nginx/html

EXPOSE 10000

# CMD ["nginx", "-g", "daemon off;"]

CMD ["yarn", "prod"]