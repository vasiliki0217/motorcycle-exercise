// Get the saved language from localStorage or default to 'en'
let lang = localStorage.getItem('lang') || 'en'; // If there's no saved language, use English

// This will hold translation texts after loading
let translations = {}; // Object to store translated texts based on selected language

// Load saved theme or default
let theme = localStorage.getItem('theme') || 'light'; // Get the saved theme (light/dark) or default to light
document.documentElement.setAttribute('data-theme', theme); // Apply theme to the root <html> tag

// Function to toggle between light and dark themes
function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light'; // Switch the theme
    document.documentElement.setAttribute('data-theme', theme); // Apply the new theme
    localStorage.setItem('theme', theme); // Save the selected theme in localStorage
}

// Function to change language and reload the page
function setLanguage(newLang) {
    lang = newLang; // Update the global language variable
    localStorage.setItem('lang', lang); // Save the selected language to localStorage
    location.reload(); // Reload the page to apply the new language
}

// Load the translations JSON file and execute a callback when done
function loadTranslations(callback) {
    fetch('data/translations.json') // Fetch the translations file
        .then(res => res.json()) // Parse the file as JSON
        .then(data => {
            translations = data[lang]; // Get the part of the JSON that corresponds to the selected language
            if (callback) callback(); // Execute the callback function if provided
        });
}

// Save the selected motorcycle manufacturer
function selectManufacturer(name) {
    localStorage.setItem('manufacturer', name); // Store selected manufacturer in localStorage
}

// Save the selected motorcycle model
function selectModel(name) {
    localStorage.setItem('model', name); // Store selected model in localStorage
}

// Load manufacturers on index.html (Page 1)
function loadManufacturers() {
    loadTranslations(() => { // Load translation first
        document.getElementById('page-title').innerText = translations['title']; // Set translated title on the page
    });
}

// Load models of a selected manufacturer on models.html (Page 2)
function loadModels() {
    loadTranslations(() => { // Load translation first
        // Set translated titles and buttons
        document.getElementById('models-title').innerText = translations['models-title'];
        document.getElementById('back-manufacturers').innerText = translations['back-manufacturers'];

        const manu = localStorage.getItem('manufacturer'); // Get selected manufacturer from storage

        fetch('data/models.json') // Load all models
            .then(res => res.json()) // Parse JSON file
            .then(data => {
                const models = data[manu]; // Get models of the selected manufacturer
                const list = document.getElementById('models-list'); // Get the container element to display the list

                models.forEach(m => { // For each model of the manufacturer
                    const li = document.createElement('li'); // Create list item
                    const a = document.createElement('a'); // Create clickable link
                    a.href = 'details.html'; // Link to Page 3
                    a.onclick = () => selectModel(m.name); // Save selected model when clicked

                    const img = document.createElement('img'); // Create image element
                    img.src = 'images/' + m.image; // Set image source
                    img.alt = m.name; // Set alternate text for image
                    img.width = 100; // Set image width

                    a.appendChild(img); // Add image to link
                    a.appendChild(document.createElement('br')); // Add line break
                    a.appendChild(document.createTextNode(m.name)); // Add model name as text

                    li.appendChild(a); // Add link to list item
                    list.appendChild(li); // Add list item to the list container
                });
            });
    });
}

// Load details for selected model on details.html (Page 3)
function loadDetails() {
    loadTranslations(() => { // Load translation first
        // Set translated navigation buttons
        document.getElementById('back-manufacturers').innerText = translations['back-manufacturers'];
        document.getElementById('back-models').innerText = translations['back-models'];

        const manu = localStorage.getItem('manufacturer'); // Get selected manufacturer
        const modelName = localStorage.getItem('model'); // Get selected model

        fetch('data/models.json') // Load models data
            .then(res => res.json()) // Parse JSON file
            .then(data => {
                const model = data[manu].find(m => m.name === modelName); // Find the specific model

                // Update the page with model information
                document.getElementById('model-name').innerText = model.name; // Show model name
                document.getElementById('model-details').innerText = model.details; // Show model details

                document.getElementById('model-img').src = 'images/' + model.image; // Set model image
                document.getElementById('model-img').alt = model.name; // Set alt text for image

                const div = document.getElementById('championships'); // Get container for championship table
                div.innerHTML = ''; // Clear any existing content

                if (model.championships.length === 0) { // If no championship history
                    div.innerText = translations['no-championships']; // Show message
                } else {
                    // Add a translated title above the table
                    const title = document.createElement('h3');
                    title.innerText = translations['recent-championships'];
                    div.appendChild(title);

                    const table = document.createElement('table'); // Create table for years

                    model.championships.forEach(year => { // For each championship year
                        const row = document.createElement('tr'); // Create table row

                        const labelCell = document.createElement('td'); // First cell with label
                        labelCell.innerText = translations['year']; // Translated "Year"
                        row.appendChild(labelCell);

                        const yearCell = document.createElement('td'); // Second cell with the actual year
                        yearCell.innerText = year;
                        row.appendChild(yearCell);

                        table.appendChild(row); // Add the row to the table
                    });

                    div.appendChild(table); // Add the table to the container
                }
            });
    });
}

