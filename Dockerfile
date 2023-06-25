FROM archlinux:latest
WORKDIR /root
COPY ./* ./
CMD bash -c "pacman --noconfirm -Syyu git nodejs yarn jdk-openjdk libxtst && yarn run all"
