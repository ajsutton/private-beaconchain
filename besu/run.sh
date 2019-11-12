#!/bin/bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null 2>&1 && pwd )"
docker rm /eth1 > /dev/null 2>&1 || true
docker run --mount "type=bind,source=${DIR},target=/besu" -p 8545:8545 -p 8546:8546 --network="beacontest" --name="eth1" hyperledger/besu:1.3.4 --genesis-file=/besu/eth1-genesis.json --data-path=/besu/data --host-whitelist="*" \
  --rpc-http-enabled --rpc-http-host="0.0.0.0" --rpc-http-cors-origins="*" --rpc-http-apis="WEB3,NET,ADMIN,ETH,DEBUG" \
  --rpc-ws-enabled --rpc-ws-host="0.0.0.0" \
  --bootnodes="" --miner-enabled --miner-coinbase=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73 \
  --min-gas-price=0
