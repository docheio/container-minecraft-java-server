MEMORY=$(echo $(./getmem --mb) | jq -r .total)
MEMORY_INT="${MEMORY//[^0-9]/}"
MEMORY_INT=$((MEMORY_INT - 500))
MEMORY="${MEMORY_INT}m"
echo $MEMORY

java -Xmx$MEMORY -Xms$MEMORY -jar server.jar nogui