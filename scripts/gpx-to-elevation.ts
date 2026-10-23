#!/usr/bin/env npx tsx
/**
 * gpx-to-elevation.ts
 *
 * Reads a GPX file from data/gpx/<slug>.gpx and generates an ElevationPoint[]
 * array representing accumulated elevation gain (not absolute altitude).
 *
 * Usage:
 *   npx tsx scripts/gpx-to-elevation.ts <slug>
 *   npx tsx scripts/gpx-to-elevation.ts laguna-esmeralda
 *
 * The GPX should contain a single <trk> with <trkpt lat="" lon=""><ele>…</ele></trkpt>.
 * Output: the points array (JSON) ready to paste into data/elevation.ts.
 *
 * Notes:
 *   - Distance is computed via Haversine between consecutive trackpoints.
 *   - Only elevation GAINS are accumulated (descents are ignored).
 *   - The output is resampled to ~40 evenly spaced points along the one-way distance.
 *   - If the track is round-trip, pass --oneway to use only the first half.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

/* ───────── Config ───────── */

const RESAMPLE_STEPS = 40;

/* ───────── CLI ───────── */

const args = process.argv.slice(2);
const oneway = args.includes("--oneway");
const slug = args.find((a) => !a.startsWith("--"));

if (!slug) {
  console.error("Usage: npx tsx scripts/gpx-to-elevation.ts [--oneway] <slug>");
  process.exit(1);
}

const gpxPath = resolve(__dirname, "..", "data", "gpx", `${slug}.gpx`);

let xml: string;
try {
  xml = readFileSync(gpxPath, "utf-8");
} catch {
  console.error(`GPX not found: ${gpxPath}`);
  console.error("Place the GPX file at data/gpx/<slug>.gpx and retry.");
  process.exit(1);
}

/* ───────── Parse trackpoints ───────── */

interface RawPoint {
  lat: number;
  lon: number;
  ele: number;
}

const trkptRegex = /<trkpt\s+lat="([^"]+)"\s+lon="([^"]+)"[^>]*>[\s\S]*?<ele>([^<]+)<\/ele>[\s\S]*?<\/trkpt>/g;
const rawPoints: RawPoint[] = [];
let match: RegExpExecArray | null;

while ((match = trkptRegex.exec(xml)) !== null) {
  rawPoints.push({
    lat: parseFloat(match[1]),
    lon: parseFloat(match[2]),
    ele: parseFloat(match[3]),
  });
}

if (rawPoints.length < 2) {
  console.error(`Only ${rawPoints.length} trackpoints found — need at least 2.`);
  process.exit(1);
}

console.error(`Parsed ${rawPoints.length} trackpoints from ${gpxPath}`);

/* ───────── Haversine distance (meters) ───────── */

function haversine(a: RawPoint, b: RawPoint): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLon * sinLon;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* ───────── Build cumulative distance + gain ───────── */

interface CumPoint {
  distKm: number;
  gainM: number;
}

const cumPoints: CumPoint[] = [{ distKm: 0, gainM: 0 }];
let totalDist = 0;
let totalGain = 0;

for (let i = 1; i < rawPoints.length; i++) {
  totalDist += haversine(rawPoints[i - 1], rawPoints[i]) / 1000;
  const dEle = rawPoints[i].ele - rawPoints[i - 1].ele;
  if (dEle > 0) totalGain += dEle;
  cumPoints.push({ distKm: totalDist, gainM: totalGain });
}

console.error(`Total track distance: ${totalDist.toFixed(2)} km`);
console.error(`Total elevation gain: ${totalGain.toFixed(0)} m`);

/* ───────── Use first half if --oneway ───────── */

let usePoints = cumPoints;
if (oneway) {
  const halfDist = totalDist / 2;
  usePoints = cumPoints.filter((p) => p.distKm <= halfDist);
  console.error(`--oneway: using first ${usePoints.length} points up to ${halfDist.toFixed(2)} km`);
}

const maxDist = usePoints[usePoints.length - 1].distKm;
const maxGain = usePoints[usePoints.length - 1].gainM;

/* ───────── Resample to evenly spaced points ───────── */

interface ElevationPoint {
  km: number;
  alt: number;
}

function interpolateGain(targetKm: number): number {
  for (let i = 1; i < usePoints.length; i++) {
    if (usePoints[i].distKm >= targetKm) {
      const prev = usePoints[i - 1];
      const curr = usePoints[i];
      const t = (targetKm - prev.distKm) / (curr.distKm - prev.distKm || 1);
      return prev.gainM + t * (curr.gainM - prev.gainM);
    }
  }
  return maxGain;
}

const output: ElevationPoint[] = [];
for (let i = 0; i <= RESAMPLE_STEPS; i++) {
  const km = (i / RESAMPLE_STEPS) * maxDist;
  const alt = interpolateGain(km);
  output.push({
    km: +km.toFixed(2),
    alt: +alt.toFixed(0),
  });
}

/* ───────── Print result ───────── */

console.error(`\nResampled to ${output.length} points.`);
console.error(`Paste this into the profile definition in data/elevation.ts:\n`);

console.log(`// Generated from data/gpx/${slug}.gpx`);
console.log(`// totalKm: ${maxDist.toFixed(2)}, desnivelM: ${maxGain.toFixed(0)}`);
console.log(`points: ${JSON.stringify(output, null, 2)},`);
console.log(`hasGpx: true,`);
