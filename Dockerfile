FROM archlinux:latest
RUN pacman --noconfirm -Syyu git
RUN pacman --noconfirm -Syyu nodejs
RUN pacman --noconfirm -Syyu npm
RUN pacman --noconfirm -Syyu yarn
RUN pacman --noconfirm -Syyu jre-openjdk
RUN pacman --noconfirm -Syyu libxtst
WORKDIR /root
COPY ./* ./
CMD yarn run all
