# pull official base image
FROM node:13.12.0-alpine as base

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY ["package.json", "package-lock.json*", "./"]

#######################

# TEST
FROM base as test
ENV NODE_ENV=development
RUN npm install --development
COPY . ./
CMD ["npm", "test"]

# DEVELOPMENT
FROM base as dev
ENV NODE_ENV=development
CMD ["npm", "start"]

# PRODUCTION
FROM base as prod
ENV NODE_ENV=production
RUN npm install --production
COPY . ./
CMD ["npm", "start"]
