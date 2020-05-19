# Base Node image
FROM node:latest
# Changing the Docker's default starting directory to avoid any owerwriting issues
WORKDIR /usr/app
# Copying the package.json file alone to pre install all packages
COPY package.json ./
# Script to install all packages
RUN npm install
# Utilising inline editing via VIM and NANO
RUN apt-get update && apt-get install -y vim nano
# Recopying all the files (including package.json)
COPY ./ ./
# Default startup command.
CMD ["npm", "run", "dev"]