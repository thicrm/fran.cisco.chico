#!/bin/bash
# Re-encode the background video for faster web loading.
# Requires ffmpeg: brew install ffmpeg
#
# Usage:
#   ./scripts/reencode-video.sh [input.mov]
# If no input is given, downloads from R2 first.

set -e

INPUT="${1:-}"
OUTPUT="video_background_optimized.mp4"
URL="https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/Screen%20Recording%202026-03-16%20at%2014.15.39.mov"

cd "$(dirname "$0")/.."

if [ -z "$INPUT" ]; then
  echo "Downloading source video..."
  curl -L -o "video_source.mov" "$URL"
  INPUT="video_source.mov"
fi

if [ ! -f "$INPUT" ]; then
  echo "Error: Input file not found: $INPUT"
  exit 1
fi

echo "Re-encoding with optimized settings (720p, faststart, H.264)..."
ffmpeg -i "$INPUT" \
  -c:v libx264 \
  -movflags +faststart \
  -preset fast \
  -crf 26 \
  -vf "scale=-2:720" \
  -an \
  -y \
  "$OUTPUT"

echo ""
echo "Done! Output: $OUTPUT"
echo "Upload this file to R2, replacing the existing video at:"
echo "  Screen Recording 2026-03-16 at 14.15.39.mp4"
