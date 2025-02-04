#!/bin/bash
set -euxo pipefail

# Generate an optimized image from an original at
# butteraugli distance 3.0, downsized to 1920x1080 max.

INPUT="$1"
OUTPUT="$2"
QUALITY=3.0
DIMENSIONS="1920x1080"

TEMP_FILE=$(mktemp /tmp/optimized.XXXXXX.jpg)
trap 'rm -f "$TEMP_FILE"' EXIT

magick "$INPUT" -resize "$DIMENSIONS>" "$TEMP_FILE"
cjpegli -d "$QUALITY" "$TEMP_FILE" "$OUTPUT"
ls -lah "$INPUT"
ls -lah "$TEMP_FILE"
ls -lah "$OUTPUT"
identify -format "%wx%h" "$OUTPUT"
