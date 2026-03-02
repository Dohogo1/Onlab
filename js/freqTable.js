export function buildTable(text) {
    if (!text) {
        return [];
    }
    const counts = new Map();
    for (const char of text) {
        counts.set(char, (counts.get(char) || 0) + 1);
    }
    const tableData = Array.from(counts, ([char, count]) => {
        return {
            char: char,
            count: count,
            freq: count / text.length
        };
    });

    tableData.sort((a, b) => b.count - a.count);
    
    return tableData;
}

export function createTable(table) {
    const tableElement = document.createElement("table");
    const headers = ["Character", "Count", "Frequency"];
    const headerRow = document.createElement("tr");
    tableElement.className = "freq-table";
    headers.forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });

    tableElement.appendChild(headerRow);

    for(const {char, count, freq} of table) {
        const row = document.createElement("tr");

        const charCell = document.createElement("td");
        charCell.textContent = `'${char}'`;
        row.appendChild(charCell); 

        const countCell = document.createElement("td");
        countCell.textContent = count;
        row.appendChild(countCell);

        const freqCell = document.createElement("td");
        freqCell.textContent = freq.toFixed(4);
        row.appendChild(freqCell);

        tableElement.appendChild(row);
    }

    return tableElement;
}