#!/bin/bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null 2>&1 && pwd )"
mkdir -p ${DIR}/output
docker rm /artemis > /dev/null 2>&1 || true
docker run --mount "type=bind,source=${DIR},target=/artemis" -p 8008:8008 --network="beacontest" --name="artemis" pegasyseng/artemis:develop \
  --config="/artemis/config.toml" \
  --logging=DEBUG