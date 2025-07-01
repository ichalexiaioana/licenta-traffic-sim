import express from 'express';
import {detaliiCompleteDrumuri} from "./scripts/database/detaliiCompleteDrumuri.js";
import {proceseazaDateDrumuri} from "./scripts/database/procesareDateDrumuri.js";
import {calculeazaIndiciiDrumuri} from "./scripts/database/calculeazaIndici.js";
import {calculeazaCongestie} from "./scripts/database/calculeazaCongestie.js";
import osmtogeojson from 'osmtogeojson';

const validTimeSetTags = ['evening_rush', 'around_noon', 'morning_rush', 'rest_hours'];
const validMethods = ['harmonic_avg_speed', 'median_speed', 'avg_speed'];
const validStartYears = Array.from({ length: 2023 - 2013 + 1 }, (_, i) => (2013 + i).toString());


const app = express();
const port = 3000;

app.use(express.json());


app.get('/healthcheck', (req, res) => {
    res.json({ status: 'ok', message: 'Server is healthy' });
});


app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

app.post('/data', (req, res) => {
    const { streetList, timeSetTag, method, startYear } = req.body;

    if (!Array.isArray(streetList) || !streetList.every(s => typeof s === 'string')) {
        return res.status(400).json({ error: 'streetList must be an array of strings' });
    }

    if (!validTimeSetTags.includes(timeSetTag)) {
        return res.status(400).json({ error: `timeSetTag must be one of: ${validTimeSetTags.join(', ')}` });
    }

    if (!validMethods.includes(method)) {
        return res.status(400).json({ error: `method must be one of: ${validMethods.join(', ')}` });
    }

    if(!validStartYears.includes(startYear)) {
        return res.status(400).json({ error: `year must be one of: ${validStartYears.join(', ')}` });
    }

    const input = {
        streetList,
        timeSetTag,
        method,
        startYear
    };
    detaliiCompleteDrumuri()
        .then(detalii => {
            const procesat = proceseazaDateDrumuri(detalii, input);
            const indici = calculeazaIndiciiDrumuri(procesat, input);
            const congestie = calculeazaCongestie(indici, input);

            res.json({
                message: 'Data received and congestion calculated successfully',
                congestie,
                input
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'err 500' });
        });

});

app.post('/map', (req, res) => {
    const coords = osmtogeojson(req.body);
    res.json({
        message: 'got the json',
        coords
    })
})