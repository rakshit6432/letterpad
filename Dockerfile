FROM node:10
WORKDIR /var/www
COPY package*.json ./
COPY ./utils ./utils/
RUN ls
RUN yarn install
COPY . .
EXPOSE 4040
# RUN yarn build
VOLUME /client
CMD [ "yarn", "dev" ]
