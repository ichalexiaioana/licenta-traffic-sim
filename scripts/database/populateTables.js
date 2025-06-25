import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../../utils/database/db.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const roadsTomTomPath = path.join(__dirname, '../../data/json/ROADS_TOMTOM.json');

const roadsTomTom = JSON.parse(fs.readFileSync(roadsTomTomPath, 'utf-8'));

const insertRoadsTomTom = async () => {
  const features = roadsTomTom.features || [];
  let inserted = 0;

  for (const feature of features) {
    const id_tomtom = feature.id_tomtom;
    const street_name = feature.streetName;
    const speed_limit = parseInt(feature.speedLimit) || null;

    try {
      await pool.query(
        `INSERT INTO roads_tomtom (id_tomtom, street_name, speed_limit)
         VALUES ($1, $2, $3)`,
        [id_tomtom, street_name, speed_limit]
      );
      inserted++;
    } catch (err) {
      console.error(err.message);
    }
  }

  console.log(`inserted ${inserted}`);

  await pool.end();
};

// insertRoadsTomTom();

const roadsPath = path.join(__dirname, '../../data/json/ROADS.json');

const roads = JSON.parse(fs.readFileSync(roadsPath, 'utf-8'));

const insertRoads = async () => {
  const features = roads.features || [];
  let inserted = 0;

  for (const feature of features) {
    const id_road = feature.id_road;
    const id_tomtom = feature.id_tomtom;
    const street_name_overpass = feature.name_overpass;
    const stree_name_tomtom = feature.name_tomtom;

    try {
      await pool.query(
        `INSERT INTO roads (id_road, id_tomtom, street_name_overpass, street_name_tomtom)
         VALUES ($1, $2, $3, $4)`,
        [id_road, id_tomtom, street_name_overpass, stree_name_tomtom]
      );
      inserted++;
    } catch (err) {
      console.error(err.message);
    }
  }

  console.log(`inserted ${inserted}`);

  await pool.end();
};

// insertRoads();

const roadsSegmentsPath = path.join(__dirname, '../../data/json/ROADS_SEGMENTS.json');

const roadsSegments = JSON.parse(fs.readFileSync(roadsSegmentsPath, 'utf-8'));

const insertRoadsSegments = async () => {
  const features = roadsSegments.features || [];
  let inserted = 0;

  for (const feature of features) {
    const id_segment = feature.id_segment;
    const id_road = feature.id_road;
    const street_name = feature.name;
    const lanes_total = feature.properties.lanes;
    const lanes_forward = feature.properties['lanes:forward'];
    const lanes_backward = feature.properties['lanes:backward'];
    const lanes_bus_forward = feature.properties['lanes:bus:forward'];
    const lanes_bus_backward = feature.properties['lanes:bus:backward'];
    const oneway = feature.properties.oneway;
    const facing = feature.facing;

    try {
      await pool.query(
        `INSERT INTO roads_segments (id_segment, id_road, street_name, lanes_total, lanes_forward, lanes_backward, lanes_bus_forward, lanes_bus_backward, oneway, facing)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [id_segment, id_road, street_name, lanes_total, lanes_forward, lanes_backward, lanes_bus_forward, lanes_bus_backward, oneway, facing]
      );
      inserted++;
    } catch (err) {
      console.error(err.message, feature.id_road);
    }
  }

  console.log(`inserted ${inserted}`);

  await pool.end();
};

// insertRoadsSegments();

const stationsPath = path.join(__dirname, '../../data/json/STATIONS.json');

const stations = JSON.parse(fs.readFileSync(stationsPath, 'utf-8'));

const insertstations = async () => {
  const features = stations.features || [];
  let inserted = 0;

  for (const feature of features) {
    const id_station = feature.id_station;
    const id_segment = feature.id_segment;
    const station_name = feature.name;
    const pt_lanes = feature.properties.nr_ref;

    try {
      await pool.query(
        `INSERT INTO stations (id_station, id_segment, station_name, pt_lanes)
         VALUES ($1, $2, $3, $4)`,
        [id_station, id_segment, station_name, pt_lanes]
      );
      inserted++;
    } catch (err) {
      console.error(err.message, feature.id_station);
    }
  }

  console.log(`inserted ${inserted}`);

  await pool.end();
};

// insertstations();

const speedTomTomPath = path.join(__dirname, '../../data/json/SPEED_TOMTOM.json');

const speedTomTom = JSON.parse(fs.readFileSync(speedTomTomPath, 'utf-8'));

const insertSpeedTomTom = async () => {
  const features = speedTomTom.features || [];
  let inserted = 0;

  for (const feature of features) {
    const id_speed = uuidv4();
    const id_tomtom = feature.id_tomtom;
    const time_set = feature.timeSet;
    const time_set_tag = feature.timeSetTag;
    const harmonic_avg_speed = feature.harmonicAverageSpeed;
    const median_speed = feature.medianSpeed;
    const avg_speed = feature.averageSpeed;

    try {
      await pool.query(
        `INSERT INTO speed_tomtom (id_speed, id_tomtom, time_set, time_set_tag, harmonic_avg_speed, median_speed, avg_speed)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id_speed, id_tomtom, time_set, time_set_tag, harmonic_avg_speed, median_speed, avg_speed]
      );
      inserted++;
    } catch (err) {
      console.error(err.message);
    }
  }

  console.log(`inserted ${inserted}`);

  await pool.end();
};

// insertSpeedTomTom();