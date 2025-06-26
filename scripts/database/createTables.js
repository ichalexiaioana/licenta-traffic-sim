import { pool } from '../../utils/database/db.js';

const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS ROADS_TOMTOM (
        id_tomtom TEXT PRIMARY KEY,
        street_name TEXT UNIQUE,
        speed_limit INTEGER
    );

    CREATE TABLE IF NOT EXISTS ROADS (
        id_road TEXT PRIMARY KEY,
        id_tomtom TEXT REFERENCES ROADS_TOMTOM(id_tomtom),
        street_name_overpass TEXT,
        street_name_tomtom TEXT
    );

    CREATE TABLE IF NOT EXISTS ROADS_SEGMENTS (
        id_segment TEXT PRIMARY KEY,
        id_road TEXT REFERENCES ROADS(id_road),
        highway TEXT,
        street_name TEXT,
        lanes_total INTEGER,
        lanes_forward INTEGER,
        lanes_backward INTEGER,
        lanes_bus_forward INTEGER,
        lanes_bus_backward INTEGER,
        oneway BOOLEAN,
        length NUMERIC(10, 2),
        facing TEXT CHECK (facing IN ('N', 'S', 'E', 'V'))
    );

    CREATE TABLE IF NOT EXISTS STATIONS (
        id_station TEXT PRIMARY KEY,
        id_segment TEXT REFERENCES ROADS_SEGMENTS(id_segment),
        station_name TEXT,
        pt_lanes INTEGER
    );

    CREATE TABLE SPEED_TOMTOM (
        id_speed TEXT PRIMARY KEY,
        id_tomtom TEXT REFERENCES ROADS_TOMTOM(id_tomtom),
        time_set INTEGER CHECK (time_set IN (2, 3, 4, 5)),
        time_set_tag TEXT,
        harmonic_avg_speed NUMERIC(10, 2),
        median_speed NUMERIC(10, 2),
        avg_speed NUMERIC(10, 2)
    );
`;

const createTablesSQL1 = `
ALTER TABLE ROADS_SEGMENTS
ADD COLUMN length NUMERIC(10, 2),
ADD COLUMN highway TEXT;
`


const run = async () => {
  try {
    await pool.query(createTablesSQL);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
};

// run();
