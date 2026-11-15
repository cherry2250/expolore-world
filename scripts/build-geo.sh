#!/usr/bin/env bash
# Natural Earth 1:50m 국가 경계(퍼블릭 도메인)를 받아 단순화한 TopoJSON으로 변환합니다.
set -euo pipefail
cd "$(dirname "$0")/.."
TMP=$(mktemp -d)
curl -sL -o "$TMP/ne.geojson" https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson
npx mapshaper "$TMP/ne.geojson" \
  -filter-fields ISO_A2_EH,ADM0_A3,NAME,CONTINENT \
  -rename-fields iso=ISO_A2_EH,a3=ADM0_A3,name=NAME,continent=CONTINENT \
  -simplify 25% keep-shapes \
  -o format=topojson quantization=100000 src/data/geo/world.topo.json
rm -rf "$TMP"
