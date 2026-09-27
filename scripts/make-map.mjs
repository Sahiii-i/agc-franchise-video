// Builds src/film/map.json: a dotted world map, the office cities and an arc from Singapore HQ to each.
// Land from world-atlas (Natural Earth, public domain). Projection: Natural Earth, centred on 150°E so
// Europe sits at the left edge, the Americas at the right and no arc from Singapore crosses the cut.
//
//   node scripts/make-map.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { geoContains, geoDistance, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const WIDTH = 2000;
const SPACING = 11;

const topo = JSON.parse(readFileSync("node_modules/world-atlas/land-50m.json", "utf8"));
const land = feature(topo, topo.objects.land);
const projection = geoNaturalEarth1().rotate([-150, 0]).fitWidth(WIDTH, { type: "Sphere" });
const [[, top], [, bottom]] = geoPath(projection).bounds({ type: "Sphere" });
const HEIGHT = Math.ceil(bottom - top);

const dots = [];
for (let y = SPACING / 2; y < HEIGHT; y += SPACING) {
  for (let x = SPACING / 2; x < WIDTH; x += SPACING) {
    const lonlat = projection.invert([x, y + top]);
    if (!lonlat || lonlat[1] < -58) continue;
    if (geoContains(land, lonlat)) dots.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
  }
}

// Office cities, read off the "Locations worldwide" collages on the AGC site (src/assets/images/locations).
const HQ = { name: "Singapore", lon: 103.82, lat: 1.35 };
const CITIES = [
  ["Johor Bahru", 103.74, 1.49], ["Kuala Lumpur", 101.69, 3.14], ["Petaling Jaya", 101.61, 3.11],
  ["Bali", 115.22, -8.65], ["Ho Chi Minh City", 106.63, 10.82], ["Bangkok", 100.5, 13.75],
  ["Nha Trang", 109.19, 12.24], ["Da Nang", 108.2, 16.05], ["Yangon", 96.2, 16.87],
  ["Manila", 120.98, 14.6], ["Colombo", 79.86, 6.93], ["Hong Kong", 114.17, 22.32],
  ["Pondicherry", 79.81, 11.94], ["Taipei", 121.57, 25.03], ["Perth", 115.86, -31.95],
  ["Shanghai", 121.47, 31.23], ["Chandigarh", 76.78, 30.73], ["Daegu", 128.6, 35.87],
  ["Seoul", 126.98, 37.57], ["Tokyo", 139.69, 35.68], ["Melbourne", 144.96, -37.81],
  ["Dubai", 55.27, 25.2], ["Doha", 51.53, 25.29], ["Tashkent", 69.24, 41.3],
  ["Almaty", 76.89, 43.24], ["Bishkek", 74.59, 42.87], ["Quatre Bornes", 57.48, -20.26],
  ["Cesme", 26.3, 38.32], ["Munich", 11.58, 48.14], ["Paris", 2.35, 48.86],
  ["Los Angeles", -118.24, 34.05],
];

const at = (lon, lat) => {
  const [x, y] = projection([lon, lat]);
  return [Math.round(x * 10) / 10, Math.round((y - top) * 10) / 10];
};
const hq = at(HQ.lon, HQ.lat);
const cities = CITIES.map(([name, lon, lat]) => ({ name, xy: at(lon, lat), km: Math.round(geoDistance([HQ.lon, HQ.lat], [lon, lat]) * 6371) }))
  .sort((a, b) => a.km - b.km)
  .map((city) => {
    // A quadratic arc bowed to the north, so lines read as flights, not a spider web.
    const [x0, y0] = hq;
    const [x1, y1] = city.xy;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const length = Math.hypot(dx, dy);
    let nx = -dy / length;
    let ny = dx / length;
    if (ny > 0) [nx, ny] = [-nx, -ny];
    const bow = Math.min(0.28 * length, 160);
    const cx = (x0 + x1) / 2 + nx * bow;
    const cy = (y0 + y1) / 2 + ny * bow;
    return { ...city, arc: `M${x0} ${y0} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x1} ${y1}` };
  });

writeFileSync("src/film/map.json", JSON.stringify({ width: WIDTH, height: HEIGHT, spacing: SPACING, hq, cities, dots }));
console.log(`map ${WIDTH}x${HEIGHT}, ${dots.length} dots, ${cities.length} cities, farthest ${cities.at(-1).name} ${cities.at(-1).km} km`);
