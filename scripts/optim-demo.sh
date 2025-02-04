#!/bin/bash
set -euxo pipefail

# Generate optimized images from originals at butteraugli
# distances of 0.0 to 5.0 by 0.2 increments.

ORIG=(
	scenes_orig/south-florida.jpg
	scenes_orig/slc.jpg
	scenes_orig/sf.jpg
	scenes_orig/seattle.jpg
	scenes_orig/README.md
	scenes_orig/portland.jpg
	scenes_orig/minneapolis.jpg
	scenes_orig/jacksonville.jpg
	scenes_orig/indianapolis.jpg
	scenes_orig/denver.jpg
	scenes_orig/chicago.jpg
	scenes_orig/baltimore.jpg
)

for img in "${ORIG[@]}"; do
	if [[ $img == *.jpg ]]; then
		for quality in $(seq 0.0 0.2 5.0); do
			quality_formatted=$(printf "%02.0f" "$(echo "$quality * 10" | bc)")
			output_dir="scenes_${quality_formatted}"
			output_dir="scenes_${quality//./}"
			mkdir -p "$output_dir"
			output_file="$output_dir/$(basename "$img")"
			cjpegli -d "$quality" "$img" "$output_file" &
		done
		wait
	fi
done

du -sh scenes_*
