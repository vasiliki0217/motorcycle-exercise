// Get the saved language from localStorage or default to 'en'
let lang = localStorage.getItem('lang') || 'en';

// This will hold translation texts after loading
let translations = {};

// Function to set the language and reload the page
function setLanguage(newLang) {
    lang = newLang;
    localStorage.setItem('lang', lang); // Save language in localStorage
    location.reload(); // Reload the page to apply new language
}

// Load the translations JSON and call a function after it's loaded
function loadTranslations(callback) {
    fetch('data/translations.json') // Load translation file
        .then(res => res.json()) // Convert response to JSON
        .then(data => {
            translations = data[lang]; // Store translations for selected language
            if (callback) callback(); // Call the function after loading
        });
}

// Save the selected manufacturer to localStorage
function selectManufacturer(name) {
    localStorage.setItem('manufacturer', name);
}

// Save the selected model to localStorage
function selectModel(name) {
    localStorage.setItem('model', name);
}

// Load content for the index.html page
function loadManufacturers() {
    loadTranslations(() => {
        document.getElementById('page-title').innerText = translations['title'];
    });
}

// Load models for selected manufacturer in models.html
function loadModels() {
    loadTranslations(() => {
        document.getElementById('models-title').innerText = translations['models-title'];
        document.getElementById('back-manufacturers').innerText = translations['back-manufacturers'];

        const manu = localStorage.getItem('manufacturer');

        fetch('data/models.json')
            .then(res => res.json())
            .then(data => {
                const models = data[manu];
                const list = document.getElementById('models-list');

                models.forEach(m => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = 'details.html';
                    a.onclick = () => selectModel(m.name);

                    const img = document.createElement('img');
                    img.src = 'images/' + m.image;
                    img.alt = m.name;
                    img.width = 100;
                    a.appendChild(img);
                    a.appendChild(document.createElement('br'));
                    a.appendChild(document.createTextNode(m.name));

                    li.appendChild(a);
                    list.appendChild(li);
                });
            });
    });
}

// Load details for selected model in details.html
function loadDetails() {
    loadTranslations(() => {
        document.getElementById('back-manufacturers').innerText = translations['back-manufacturers'];
        document.getElementById('back-models').innerText = translations['back-models'];

        const manu = localStorage.getItem('manufacturer');
        const modelName = localStorage.getItem('model');

        fetch('data/models.json')
            .then(res => res.json())
            .then(data => {
                const model = data[manu].find(m => m.name === modelName);

                document.getElementById('model-name').innerText = model.name;
                document.getElementById('model-details').innerText = model.details;

                document.getElementById('model-img').src = 'images/' + model.image;
                document.getElementById('model-img').alt = model.name;

                const div = document.getElementById('championships');
                if (model.championships.length === 0) {
                    div.innerText = translations['no-championships'];
                } else {
                    const table = document.createElement('table');
                    model.championships.forEach(year => {
                        const row = document.createElement('tr');
                        const cell = document.createElement('td');
                        cell.innerText = year;
                        row.appendChild(cell);
                        table.appendChild(row);
                    });
                    div.appendChild(table);
                }
            });
    });
}
