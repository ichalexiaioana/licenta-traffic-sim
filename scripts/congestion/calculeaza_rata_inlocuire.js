import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../../database/ins/date_ins.csv');

const csvRaw = fs.readFileSync(filePath, "utf8");
const records = parse(csvRaw, { columns: true, skip_empty_lines: true });

const masiniPeRezident = [];
const vanzariPeRezident = [];
const ani = [];

for (const row of records) {
    const an = parseInt(row.an);
    const rezidenti = parseInt(row.nr_rezidenti);
    const masini = parseInt(row.masini_total);
    const vanzari = parseFloat(row.vanzari_stb);

    if (rezidenti && masini && vanzari) {
        ani.push(an);
        masiniPeRezident.push(masini / rezidenti);
        vanzariPeRezident.push(vanzari / rezidenti);
    }
}

function calcDifProcent(series) {
    const difs = [];
    for (let i = 1; i < series.length; i++) {
        const previous = series[i - 1];
        const current = series[i];
        const change = (current - previous) / previous;
        difs.push(change * 100);
    }
    return difs;
}

const difMasini = calcDifProcent(masiniPeRezident);
const difVanzari = calcDifProcent(vanzariPeRezident);

const avgShiftMasini = difMasini.reduce((sum, val) => sum + val, 0) / difMasini.length;
const avgShiftVanzari = difVanzari.reduce((sum, val) => sum + val, 0) / difVanzari.length;

console.log("\nCu toate datele")
console.log("Schimbare medie relativa masini :", avgShiftMasini.toFixed(2));
console.log("Schimbare medie relativa vanzari:", avgShiftVanzari.toFixed(2));
console.log("Diferenta de schimbare medie:", (avgShiftVanzari-avgShiftMasini).toFixed(2));

const startYear = 2020;
const startIndex = ani.findIndex(an => an === startYear);

if (startIndex > 0) {
    const filteredDiffMasini = difMasini.slice(startIndex - 1);
    const filteredDiffVanzari = difVanzari.slice(startIndex - 1);
    const avgShiftMasiniYear = filteredDiffMasini.reduce((sum, val) => sum + val, 0) / filteredDiffMasini.length;
    const avgShiftVanzariYear = filteredDiffVanzari.reduce((sum, val) => sum + val, 0) / filteredDiffVanzari.length;  

    console.log(`\nDin ${startYear}`)
    console.log("Schimbare medie relativa masini :", avgShiftMasiniYear.toFixed(2));
    console.log("Schimbare medie relativa vanzari:", avgShiftVanzariYear.toFixed(2));
    console.log("Diferenta de schimbare medie:", (avgShiftVanzariYear-avgShiftMasiniYear).toFixed(2));
}