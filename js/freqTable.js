export function buildTable(text) {
    const tableData = {};
    for (const char of text) {
        tableData[char] = [(tableData[char]?.[0] || 0) + 1, null];
    }
    for (const char of Object.keys(tableData)) {
        tableData[char][1] = (tableData[char][0] / text.length);
    }
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
    const data = Object.entries(table).map(([char, [count, freq]]) => ({
        Character: char,
        Count: count,
        Frequency: freq.toFixed(4)
    }));
    data.forEach(item => {
        const row = document.createElement("tr");
        Object.values(item).forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableElement.appendChild(row);
    });
    return tableElement;
}