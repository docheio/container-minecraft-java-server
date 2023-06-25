FROM archlinux:latest
RUN echo Server = https://mirror.cat.net/archlinux/\$repo/os/\$arch > /etc/pacman.d/mirrorlist 
RUN pacman --noconfirm -Syyu git
RUN pacman --noconfirm -Syyu nodejs
RUN pacman --noconfirm -Syyu npm
RUN pacman --noconfirm -Syyu yarn
RUN pacman --noconfirm -Syyu jre-openjdk
RUN pacman --noconfirm -Syyu libxtst
WORKDIR /root
COPY ./* ./
CMD yarn run all
