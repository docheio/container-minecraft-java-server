ENDPOINT="https://api.purpurmc.org/v2/purpur/"
LATEST=$(curl $ENDPOINT | jq -r .versions[-1])
BUILD=$(curl "$ENDPOINT$LATEST" | jq -r .builds.latest)
echo $BUILD
wget "$ENDPOINT$LATEST/$BUILD/download" -O server.jar