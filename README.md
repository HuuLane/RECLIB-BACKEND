# RECLIB

![Publish Docker](https://github.com/HuuLane/RECLIB-BACKEND/workflows/Publish%20Docker/badge.svg?branch=master) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> For learning by doing, I have built a Web app, which simple but not crude. 

<!-- [![LICENSE]][license] [![ISSUES]][issues] [![RELESE]][relese] [![downloads]][downloads] [![build]][build] -->

 ![](./static/IMG_HOME.jpg)

## Run

```bash
$ git clone git@github.com:HuuLane/RECLIB-BACKEND.git
$ docker-compose up -d

# then go to http://localhost:3000/
```

## Dev

### Init setup

- redis

```
# up
docker run --name reclib-dev-redis -p 6379:6379 -d --rm redis:6.2.3-alpine

# down
docker stop reclib-dev-redis
```

- mongodb

```
# make sure you are under the root path of working dir!
# up
docker run --name reclib-dev-mongodb -p 27017:27017 \
    -v $PWD/static/doubanBook.agz:/var/static/doubanBook.agz \
    -v $PWD/static/mongorestore.sh:/docker-entrypoint-initdb.d/mongorestore.sh \
    -d --rm \
    mongo:4.2

# down
docker stop reclib-dev-mongodb
```

- express.js (backend)

```
npm start
```

- vue.js 2 (frontend)

```
# go to ..
npm start

# let's go to http://localhost:8080/
```
