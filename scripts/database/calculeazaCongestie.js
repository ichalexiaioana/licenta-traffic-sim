import {detaliiCompleteDrumuri} from "./detaliiCompleteDrumuri.js";
import {proceseazaDateDrumuri} from "./procesareDateDrumuri.js";
import {calculeazaIndiciiDrumuri} from "./calculeazaIndici.js";
import {calculeazaShifturiMedii} from "../congestion/calculeaza_rata_inlocuire.js"

export function calculeazaCongestie(indiciDrumuri, input){
    let congestie = 0;
    indiciDrumuri.forEach(indici => {
        congestie += (indici.time_idx);
    })
    const avgShift = calculeazaShifturiMedii(input.startYear);
    const avgShiftVal = avgShift?.partial?.diferenta ? avgShift.partial.diferenta : avgShift.total.diferenta;
    const replacementIndex = (100 - avgShiftVal) / 100;
    return parseFloat((congestie * replacementIndex / indiciDrumuri.length).toFixed(4));
}

// const input = {
//     streetList: [],
//     timeSetTag: 'around_noon',
//     method: 'median_speed',
//     startYear: 2013,
// };

// const detalii = await detaliiCompleteDrumuri();
// const procesat = proceseazaDateDrumuri(detalii, input);
// const indici = calculeazaIndiciiDrumuri(procesat, input);
// const congestie = calculeazaCongestie(indici, input);

// console.log(congestie, indici[0]);