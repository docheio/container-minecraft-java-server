FROM archlinux:latest AS build

WORKDIR /build
RUN pacman --noconfirm -Syyu git make gcc
COPY . .
RUN git submodule update --init --recursive

WORKDIR /build/get-mem-size
RUN make all

FROM archlinux:latest AS installation

WORKDIR /install
RUN pacman --noconfirm -Syyu wget curl jq
COPY install.sh .
RUN bash install.sh

FROM archlinux:latest

RUN echo Server = https://mirror.cat.net/archlinux/\$repo/os/\$arch > /etc/pacman.d/mirrorlist 
RUN pacman --noconfirm -Syyu jq
RUN pacman --noconfirm -Syyu jre-openjdk
RUN pacman --noconfirm -Syyu libxtst

WORKDIR /root
COPY --from=build /build/get-mem-size/getmem .
COPY --from=installation /install/server.jar .
COPY ./run.sh .
CMD ["bash", "run.sh"]
