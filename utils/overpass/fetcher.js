import axios from 'axios';
import fs from 'fs';
import osmtogeojson from 'osmtogeojson';
import { JSDOM } from 'jsdom';
import { OVERPASS_URL } from './constants.js';

export async function fetchAndSaveGeojson({ query, savePath }) {
  try {
    const response = await axios.post(OVERPASS_URL, query, {
      headers: { 'Content-Type': 'text/plain' },
    });

    const osmData = response.data;

    const dom = new JSDOM();
    const geojson = osmtogeojson(osmData, { document: dom.window.document });

    fs.writeFileSync(savePath, JSON.stringify(geojson, null, 2));
    console.log(`saved at: ${savePath}`);
  } catch (err) {
    console.error('fetch err:', err.message);
  }
}
