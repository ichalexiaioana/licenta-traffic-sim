import {detaliiCompleteDrumuri} from "./detaliiCompleteDrumuri.js";
import {proceseazaDateDrumuri} from "./procesareDateDrumuri.js";
import {calculeazaIndiciiDrumuri} from "./calculeazaIndici.js";
import {calculeazaShifturiMedii} from "../congestion/calculeaza_rata_inlocuire.js";
import {congestionIndexing} from "../../utils/constants/fixedValues.js";

export function calculeazaCongestie(indiciDrumuri, input){
    let congestie = 0;
    indiciDrumuri.forEach(indici => {
        congestie += parseFloat ((indici.indicator_volum * indici.raport_viteza).toFixed(4));
    })
    // for(const indici of indiciDrumuri){
    //     congestie += indici.indicator_volum * indici.raport_viteza;
    // }
    const shifturiMedii = calculeazaShifturiMedii(input.startYear);
    const procentDezlocuire = shifturiMedii?.partial?.diferenta ? shifturiMedii.partial.diferenta : shifturiMedii.total.diferenta;
    const indiceDezlocuire = 1 - procentDezlocuire/100;
    console.log(procentDezlocuire);
    console.log(indiceDezlocuire);
    return parseFloat((congestie * indiceDezlocuire * congestionIndexing).toFixed(4));
}
const input = {
    streetList: [],
    timeSetTag: 'around_noon',
    method: 'harmonic_avg_speed',
    startYear: 2013
};

// const detalii = await detaliiCompleteDrumuri();
// const procesat = proceseazaDateDrumuri(detalii, input);
// const indici = calculeazaIndiciiDrumuri(procesat, input);
// const congestie = calculeazaCongestie(indici, input);
//
// console.log(congestie);