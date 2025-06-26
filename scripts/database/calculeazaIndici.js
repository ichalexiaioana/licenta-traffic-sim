import {proceseazaDateDrumuri} from "./procesareDateDrumuri.js";
import {detaliiCompleteDrumuri} from "./detaliiCompleteDrumuri.js";

export function calculeazaIndiciiDrumuri(drumuriProcesate, input) {
    const rezultate = [];

    for (const drum of drumuriProcesate) {
        let sumaLiniiPutine = 0;
        let sumaLiniiMulte = 0;

        for (const segment of drum.segments) {
            const { lanes_total, lanes_new, length, sum_pt_lanes } = segment;

            const l_total = lanes_total;
            const l_new = lanes_new > 1 ? lanes_new : 1;
            const lungime = parseFloat(length) || 0;
            const pt_lanes = (parseInt(sum_pt_lanes) || 0) + 1;

            sumaLiniiPutine += pt_lanes * lungime * (l_total / l_new);
            sumaLiniiMulte  += pt_lanes * lungime;
        }

        const raportViteza = (drum.speed_limit && drum.speed_value)
            ? drum.speed_limit / drum.speed_value
            : null;
        const sp = parseFloat(sumaLiniiPutine.toFixed(4));
        const sm = parseFloat(sumaLiniiMulte.toFixed(4))

        rezultate.push({
            id_road: drum.id_road,
            volum_linii_putine: sp,
            volum_linii_multe: sm,
            indicator_volum: parseFloat ((sp/sm).toFixed(4)),
            raport_viteza: raportViteza !== null ? parseFloat(raportViteza.toFixed(4)) : null
        });
    }

    return rezultate;
}

const input = {
    streetList: ['59146e13-6b1e-4021-a2c7-a9f04a9e3a9f', 'road_456'],
    timeSetTag: 'evening_rush',
    method: 'avg_speed',
    startYear: 2020
};

const detalii = await detaliiCompleteDrumuri();
const procesat = proceseazaDateDrumuri(detalii, input);
const indici = calculeazaIndiciiDrumuri(procesat, input);
// console.log(procesat[4], indici[4]);