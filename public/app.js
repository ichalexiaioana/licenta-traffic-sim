const map = L.map('map').setView([44.4268, 26.1025], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let items = [];
let selected = [];
const selectedOnMap = new Map();

function normalize(str) {
    return str
        .toLowerCase()
        .replace(/ă|â/g, 'a')
        .replace(/î/g, 'i')
        .replace(/ș/g, 's')
        .replace(/ț/g, 't')
}

async function loadItems() {
    try {
        const res = await fetch('/data/ROADS.json');
        items = await res.json();
    } catch (err) {
        console.error("Failed to load JSON:", err);
    }
}

async function updateSuggestions(inputVal) {
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';

    if (!inputVal) return;

    const seenTomTomNames = new Set();

    const matches = items.features
        .filter(item =>
            normalize(item.name_overpass).includes(normalize(inputVal)) &&
            !selected.some(sel => sel.id_road === item.id_road) &&
            item.name_tomtom &&
            !seenTomTomNames.has(item.name_tomtom) &&
            seenTomTomNames.add(item.name_tomtom)
        )
        .sort((a, b) => a.name_overpass.localeCompare(b.name_overpass));

    matches.forEach(item => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = item.name_overpass;
        div.onclick = async () => {
            if (!selected.some(sel => sel.id_road === item.id_road)) {
                selected.push(item);
                await renderSelected(item, 'add');
            }
            document.getElementById('streetInput').value = '';
            suggestions.innerHTML = '';
        };

        suggestions.appendChild(div);
    });
}

async function renderSelected(item, action) {
    const container = document.getElementById('selectedList');
    if(action==='add'){
        const menu = document.getElementById('left-panel');
        menu.classList.add('left-panel-loading-state');
        const tag = document.createElement('div');
        tag.setAttribute('id', item.id_road)
        tag.className = 'selected-tag';
        tag.textContent = item.name_overpass;

        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove';
        removeBtn.textContent = 'x';
        removeBtn.onclick = () => {
            selected = selected.filter(obj => obj.id_road !== item.id_road);
            renderSelected(item, 'remove');
        };

        tag.appendChild(removeBtn);
        container.appendChild(tag);

                const query = `
            [out:json][timeout:25];
            area["name"="București"]->.searchArea;
            way["name"="${item.name_overpass}"]["highway"~"primary|secondary|tertiary"](area.searchArea);
            out body;
            >;
            out skel qt;
        `;
        try{
            const resOverpass = await fetch("https://overpass-api.de/api/interpreter", {
                method: "POST",
                body: query,
            });
            const data = await resOverpass.json();
            const resServer = await fetch('/map', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const resJson = await resServer.json();
            const coordsSets = resJson.coords.features.map((entry)=> {
                return entry.geometry;
            });
            const layer = L.geoJSON(coordsSets, {color: 'red'}).addTo(map);
            selectedOnMap.set(item.id_road, layer);
            menu.classList.remove('left-panel-loading-state');

        }catch(err){
            console.error(err.message)
        }
        
    }
    else if (action=='remove'){
        container.removeChild(document.getElementById(item.id_road));
        const layer = selectedOnMap.get(item.id_road);
        layer.removeFrom(map);
        selectedOnMap.delete(item.id_road);
    }
    document.getElementById('streetList').value = selected.map(s => s.id_road).join(',');
}

document.getElementById('streetInput').addEventListener('input', async (e) => {
    updateSuggestions(e.target.value);
});

document.addEventListener('click', (e) => {
    if (!document.getElementById('suggestions').contains(e.target) &&
        e.target.id !== 'streetInput') {
        document.getElementById('suggestions').innerHTML = '';
    }
});

const responseContainer = document.getElementById('responseOutput');
document.getElementById('dataForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    responseContainer.innerHTML = '<p>Se calculeaza...</p>';

    const streetList = document.getElementById('streetList').value
        .split(',')
        .map(str => str.trim())
        .filter(str => str.length > 0);

    const timeSetTag = document.getElementById('timeSetTag').value;
    const method = document.getElementById('method').value;
    const startYear = document.getElementById('startYear').value;

    const body = { streetList, timeSetTag, method, startYear };

    try {
        const res = await fetch('/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const result = await res.json();
        const congestie = result.congestie;
        responseContainer.innerHTML =
            `<p>Nivelul congestiei este de ${(congestie*100).toFixed(2)}%</p>
        `;
    } catch (err) {
        responseContainer.textContent = 'Error: ' + err.message;
    }
});

loadItems();
