FROM archlinux:latest
RUN pacman --noconfirm -Syyu git nodejs npm yarn jre-openjdk libxtst
WORKDIR /root
COPY ./* ./
CMD yarn run all
