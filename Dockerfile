FROM archlinux:latest AS build

WORKDIR /build
RUN pacman --noconfirm -Syyu git make gcc
COPY . .
RUN git submodule init

WORKDIR /build/get-mem-size
RUN make

FROM archlinux:latest

RUN echo Server = https://mirror.cat.net/archlinux/\$repo/os/\$arch > /etc/pacman.d/mirrorlist 
RUN pacman --noconfirm -Syyu git
RUN pacman --noconfirm -Syyu jre-openjdk
RUN pacman --noconfirm -Syyu libxtst
COPY --from=build /build/get-mem-size/getmem .
WORKDIR /root
COPY ./* ./
CMD yarn run all
