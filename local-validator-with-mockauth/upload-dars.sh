#!/bin/bash

# --- CONFIGURATION ---

if [ -f .env ]; then
  source .env
fi

DAR_FOLDER="${DAR_FOLDER:-"dars/"}"
PARTICIPANT_HOST="${PARTICIPANT_HOST:-"localhost"}"
PARTICIPANT_ADMIN_PORT="${PARTICIPANT_ADMIN_PORT:-"5002"}"

# Set the base64 option. Use "-b 0" on BSD or macOS.
BASE64_OPT="${BASE64_OPT:-"-w 0"}"

# --- MAIN LOGIC ---

if ! ls "$DAR_FOLDER"/*.dar >/dev/null 2>&1; then
  echo "Error: No .dar files found in '$DAR_FOLDER'." >&2
  exit 1
fi

for dar_file in "$DAR_FOLDER"/*.dar; do
  bytes=$(base64 ${BASE64_OPT} "$dar_file")
  description=$(basename "$dar_file")
  request=$(printf '{ "dars": [ { "bytes": "%s", "description": "%s" } ], "vet_all_packages": true, "synchronize_vetting": true }' "$bytes" "$description")

  echo "Uploading '$description' to ${PARTICIPANT_HOST}..."
  echo "$request" | grpcurl -plaintext -d @ \
    ${PARTICIPANT_HOST}:${PARTICIPANT_ADMIN_PORT} \
    com.digitalasset.canton.admin.participant.v30.PackageService.UploadDar
done

echo "Done."