#!/bin/bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null 2>&1 && pwd )"
docker rm validatorp > /dev/null 2>&1 || true
docker run -it --mount "type=bind,source=${DIR}/data,target=/data" --name="validatorp" --network="beacontest" gcr.io/prysmaticlabs/prysm/validator:sapphire \
  --beacon-rpc-provider="beaconp:4000" \
  --keystore-path=/data \
  --password=changeme \
  --verbosity debug
