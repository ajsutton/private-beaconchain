#!/bin/bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null 2>&1 && pwd )"
docker rm /beaconp > /dev/null 2>&1 || true
docker run -it --mount "type=bind,source=${DIR}/data,target=/data" -p 4000:4000 --name="beaconp" --network="beacontest" \
  gcr.io/prysmaticlabs/prysm/beacon-chain:sapphire \
  --datadir=/data \
  --web3provider ws://eth1:8546 \
  --deposit-contract 0xdddddddddddddddddddddddddddddddddddddddd \
  --no-discovery \
  --verbosity debug
