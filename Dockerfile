FROM docker.pkg.github.com/huulane/reclib/image:latest as ui-build

FROM node:alpine
WORKDIR /app
COPY package*.json .

# China is special
# RUN npm config set registry https://registry.npm.taobao.org

RUN npm cache verify
RUN npm install

# Bundle app source
COPY . .
COPY --from=ui-build /app/dist /app/public

EXPOSE 3000
