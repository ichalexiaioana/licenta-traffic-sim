import { fetchAndSaveGeojson } from '../../utils/overpass/fetcher.js';
import { ALL_ROADS_QUERY, ALL_TRANSPORT_QUERY } from '../../utils/overpass/constants.js';

fetchAndSaveGeojson({
  query: ALL_ROADS_QUERY(),
  savePath: './data/analiza harta/all_roads_overpass.geojson',
});

fetchAndSaveGeojson({
  query: ALL_TRANSPORT_QUERY(),
  savePath: './data/analiza harta/all_stations_overpass.geojson',
});