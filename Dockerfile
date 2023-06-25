FROM archlinux:latest
WORKDIR /root
# dist  Dockerfile  mount  node_modules  package.json  README.md  src  tsconfig.json  yarn.lock
COPY ./package.json ./package.json
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
COPY ./yarn.lock ./yarn.lock
CMD bash -c "pacman --noconfirm -Syyu git nodejs yarn jdk-openjdk libxtst && yarn run all"
