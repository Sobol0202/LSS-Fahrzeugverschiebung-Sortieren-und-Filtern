// ==UserScript==
// @name         LSS Fahrzeugverschiebung Sortieren und Filtern
// @version      1.1
// @description  Sortiere und filtere die Tabelle zum Verschieben von Fahrzeugen
// @author       MissSobol
// @match        https://www.leitstellenspiel.de/vehicles/*/move
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Setze diese Variable auf true, um die Tabelle schlanker zu machen
    const modifyButtons = true;

    // Hilfsfunktion zum Sortieren der Tabellenzeilen
    function sortTable(table, colIndex, ascending) {
        const tbody = table.tBodies[0];
        const rows = Array.from(tbody.rows).slice(1); // Überspringe die Kopfzeile
        rows.sort((a, b) => {
            const aText = a.cells[colIndex].textContent.trim().toLowerCase();
            const bText = b.cells[colIndex].textContent.trim().toLowerCase();
            return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });
        rows.forEach(row => tbody.appendChild(row));
    }

    // Hilfsfunktion zum Umschalten des Pfeilindikators
    function toggleSortIndicator(header, ascending) {
        const arrow = ascending ? ' ↓' : ' ↑';
        const textNode = header.querySelector('.header-text');
        if (textNode) {
            textNode.textContent = textNode.textContent.replace(/[ ↓↑]$/, '') + arrow;
        }
    }

    // Hilfsfunktion zum Filtern der Tabellenzeilen
    function filterTable(table, colIndex, query) {
        const tbody = table.tBodies[0];
        const rows = Array.from(tbody.rows).slice(1); // Überspringe die Kopfzeile
        rows.forEach(row => {
            const cellText = row.cells[colIndex].textContent.trim().toLowerCase();
            row.style.display = cellText.includes(query.toLowerCase()) ? '' : 'none';
        });
    }

    // Hilfsfunktion zum Hinzufügen der btn-xs Klasse zu Buttons
    function modifyButtonClasses() {
        const buttons = document.querySelectorAll('a.btn.btn-success');
        buttons.forEach(button => {
            if (!button.classList.contains('btn-xs')) {
                button.classList.add('btn-xs');
            }
        });
    }

    // Wähle die Tabelle und den Namens-Header sofort aus
    const table = document.querySelector('table.table-striped.table');
    if (table) {
        const nameHeader = Array.from(table.querySelectorAll('th')).find(th => th.textContent.trim() === 'Name');
        if (nameHeader) {
            // Wickele den Header-Text in ein span-Tag für einfache Manipulation
            const headerText = document.createElement('span');
            headerText.className = 'header-text';
            headerText.textContent = 'Name';
            nameHeader.textContent = '';
            nameHeader.appendChild(headerText);

            // Füge das Filter-Eingabefeld hinzu
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Filter...';
            input.style.marginLeft = '10px';
            input.addEventListener('input', () => {
                filterTable(table, nameHeader.cellIndex, input.value);
            });

            // Verhindere, dass der Klick auf das Eingabefeld das Sortieren auslöst
            input.addEventListener('click', (event) => {
                event.stopPropagation();
            });

            nameHeader.appendChild(input);

            // Füge den Klick-Eventlistener zum Sortieren hinzu
            let ascending = true;
            nameHeader.addEventListener('click', (event) => {
                if (event.target !== input) { // Schließe Klicks auf das Eingabefeld aus
                    sortTable(table, nameHeader.cellIndex, ascending);
                    toggleSortIndicator(nameHeader, ascending);
                    filterTable(table, nameHeader.cellIndex, input.value); // Wende den Filter nach dem Sortieren erneut an
                    ascending = !ascending; // Umschalten der Sortierreihenfolge für den nächsten Klick
                }
            });
        }
    }

    // Führe die Funktion zum Anpassen der Button-Klassen aus, wenn aktiviert
    if (modifyButtons) {
        modifyButtonClasses();
    }
})();
