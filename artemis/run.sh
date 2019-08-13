#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null 2>&1 && pwd )"

$DIR/dist/artemis/bin/artemis --config ${DIR}/config.toml --logging=DEBUG
