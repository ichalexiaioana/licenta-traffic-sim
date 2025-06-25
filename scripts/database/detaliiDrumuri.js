import { pool } from '../../utils/database/db.js';


export async function detaliiDrumuri() {
    try {
        const roadsRes = await pool.query(`SELECT id_road, street_name_overpass FROM roads`);
        const results = [];
        for (const road of roadsRes.rows) {
            const segRes = await pool.query(`
                SELECT * FROM roads_segments WHERE id_road = $1
            `, [road.id_road]);

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
                sum_pt_lanes: sum_pt_lanes
                });
            }

            results.push({
                id_road: road.id_road,
                road_name: road.street_name_overpass,
                segments: segments
            });
        }

        return results;
    } catch (err) {
        console.error('❌ Eroare la interogare:', err.message);
        throw err;
    }
}

const date = await detaliiDrumuri();
console.log(date.length)
// console.dir(date, { depth: null });