FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* angular.json tsconfig.json tsconfig.app.json tsconfig.spec.json karma.conf.js ./
COPY src ./src
COPY proxy.conf.json ./proxy.conf.json
RUN npm install --ignore-scripts

EXPOSE 4200
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200", "--proxy-config", "proxy.conf.json"]
