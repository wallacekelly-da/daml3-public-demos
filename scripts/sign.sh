#!/usr/bin/env bash
# Signs the preparedTransactionHash in prepare-response.json with Alice's Ed25519 key.
# Writes the raw signature to signature.bin.
# Requires OpenSSL 3 for -rawin (the LibreSSL that ships with macOS does not support it).
#
# Usage: scripts/sign.sh
set -euo pipefail

jq -r .preparedTransactionHash prepare-response.json | base64 --decode > hash.bin
openssl pkeyutl -sign -inkey private_key.der -keyform DER -rawin -in hash.bin -out signature.bin

echo "Signed at $(date -u +%FT%TZ)"
