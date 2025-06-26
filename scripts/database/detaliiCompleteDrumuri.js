import { pool } from '../../utils/database/db.js';

export async function detaliiCompleteDrumuri() {
    try {
        const roadsRes = await pool.query(`SELECT id_road, street_name_overpass, id_tomtom FROM roads`);
        const results = [];

        for (const road of roadsRes.rows) {
            const { id_road, street_name_overpass, id_tomtom } = road;

            // 1. Segmente și stații
            const segRes = await pool.query(`SELECT * FROM roads_segments WHERE id_road = $1`, [id_road]);
            const segments = [];

            for (const segment of segRes.rows) {
                const stationsRes = await pool.query(`
          SELECT pt_lanes FROM stations WHERE id_segment = $1
        `, [segment.id_segment]);

                let sum_pt_lanes = 0;
                for (const statie of stationsRes.rows) {
                    const ptLanesValue = parseInt(statie.pt_lanes);
                    if (!isNaN(ptLanesValue)) {
                        sum_pt_lanes += ptLanesValue;
                    }
                }

                segments.push({
                    ...segment,
                    sum_pt_lanes
                });
            }

            // 2. Viteze și limită de viteză
            let speed_details = [];
            let speed_limit = null;

            if (id_tomtom) {
                const speedRes = await pool.query(`
          SELECT * FROM speed_tomtom WHERE id_tomtom = $1
        `, [id_tomtom]);

                const speedLimitRes = await pool.query(`
          SELECT speed_limit FROM roads_tomtom WHERE id_tomtom = $1
        `, [id_tomtom]);

                speed_details = speedRes.rows;
                if (speedLimitRes.rows.length > 0) {
                    speed_limit = parseInt(speedLimitRes.rows[0].speed_limit);
                }
            }

            // Combinăm totul într-un singur obiect
            results.push({
                id_road,
                road_name: street_name_overpass,
                speed_limit,
                speed_details,
                segments
            });
        }

        return results;
    } catch (err) {
        console.error('❌ Eroare la detaliiCompleteDrumuri:', err.message);
        throw err;
    }
}

// const date = await detaliiCompleteDrumuri();
// console.log(date[0], '\n', date.length);
