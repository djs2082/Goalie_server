FROM node:15
RUN mkdir /goalie
WORKDIR goalie
ADD package.json  /goalie
RUN npm install
ADD . /goalie