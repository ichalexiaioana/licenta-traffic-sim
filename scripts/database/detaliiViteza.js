import { pool } from '../../utils/database/db.js';

/**
 * Returnează pentru fiecare drum (`roads.id_road`)
 * toate înregistrările din `speed_tomtom` asociate prin `id_tomtom`.
 */
export async function detaliiViteza() {
    try {
        const roadsRes = await pool.query(`SELECT id_road, street_name_overpass, id_tomtom FROM roads`);
        const results = [];

        for (const road of roadsRes.rows) {
            const { id_road, street_name_overpass, id_tomtom } = road;

            const speedRes = await pool.query(`
                SELECT * FROM speed_tomtom WHERE id_tomtom = $1
                `, [id_tomtom]);
            const speed_limit = await pool.query(`
                SELECT speed_limit FROM roads_tomtom WHERE id_tomtom = $1
                `, [id_tomtom])
            results.push({
                id_road,
                road_name: street_name_overpass,
                speed_limit: parseInt(speed_limit.rows[0].speed_limit),
                speed_details: speedRes.rows
            });
        }

        return results;
    } catch (err) {
        console.error('❌ Eroare la interogarea vitezelor:', err.message);
        throw err;
    }
}


// const date = await detaliiViteza();
console.log(date.length)