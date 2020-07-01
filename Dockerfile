FROM node:erbium-alpine

RUN apk add -U --no-cache tini
WORKDIR /usr/src/app
ENV npm_config_loglevel=warn

COPY package*.json ./
RUN npm ci --production

COPY . ./

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD [ "node", "index.js" ]