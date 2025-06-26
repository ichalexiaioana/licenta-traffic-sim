let items = [];
let selected = [];

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

function updateSuggestions(inputVal) {
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
        div.onclick = () => {
            if (!selected.some(sel => sel.id_road === item.id_road)) {
                selected.push(item);
                renderSelected();
            }
            document.getElementById('streetInput').value = '';
            suggestions.innerHTML = '';
        };

        suggestions.appendChild(div);
    });
}

function renderSelected() {
    const container = document.getElementById('selectedList');
    container.innerHTML = '';

    selected.forEach((item, index) => {
        const tag = document.createElement('div');
        tag.className = 'selected-tag';
        tag.textContent = item.name_overpass;

        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove';
        removeBtn.textContent = 'x';
        removeBtn.onclick = () => {
            selected.splice(index, 1);
            renderSelected();
        };

        tag.appendChild(removeBtn);
        container.appendChild(tag);
    });

    document.getElementById('streetList').value = document.getElementById('streetList').value = selected.map(s => s.id_road).join(',');;
}

document.getElementById('streetInput').addEventListener('input', (e) => {
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
        // console.log(result)
        const congestie = result.congestie;
        responseContainer.innerHTML =
            `<p>Nivelul de congestie este de ${(congestie*100).toFixed(2)}%</p>
        `;
    } catch (err) {
        responseContainer.textContent = 'Error: ' + err.message;
    }
});

loadItems();
