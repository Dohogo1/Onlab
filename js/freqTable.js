export function buildTable(text) {
    if (!text) return [];
    const counts = new Map();
    for (const char of text) {
        counts.set(char, (counts.get(char) || 0) + 1);
    }
    const tableData = Array.from(counts, ([char, count]) => {
        return { char: char, freq: count / text.length };
    });
    tableData.sort((a, b) => a.freq - b.freq);
    return tableData;
}

export function createTable(table) {
    const wrapper = document.createElement("div");
    
    const tableElement = document.createElement("table");
    tableElement.className = "freq-table";
    
    // Create headers (added an empty one for the delete button)
    const headerRow = document.createElement("tr");
    ["Character", "Frequency", ""].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    tableElement.appendChild(headerRow);

    // Helper function to create editable rows
    const addRow = (char, freq) => {
        const row = document.createElement("tr");

        // 1. Editable Character Cell
        const charCell = document.createElement("td");
        const charInput = document.createElement("input");
        charInput.type = "text";
        charInput.value = char;
        charInput.className = "char-input";
        charInput.style.width = "60px";
        charInput.style.textAlign = "center";
        charCell.appendChild(charInput);
        row.appendChild(charCell); 

        // 2. Editable Frequency Cell
        const freqCell = document.createElement("td");
        const freqInput = document.createElement("input");
        freqInput.type = "number";
        freqInput.step = "0.0001";
        freqInput.min = "0";
        
        freqInput.value = freq !== "" ? parseFloat(Number(freq).toFixed(4)) : "";
        
        freqInput.className = "freq-input";
        freqInput.style.width = "80px";
        freqCell.appendChild(freqInput);
        row.appendChild(freqCell);

        // 3. Delete Row Button
        const delCell = document.createElement("td");
        const delBtn = document.createElement("button");
        delBtn.textContent = "X";
        delBtn.addEventListener("click", () => {
            row.remove();
            // Tell the app the table changed so it redraws the trees
            wrapper.dispatchEvent(new Event("input", { bubbles: true })); 
        });
        delCell.appendChild(delBtn);
        row.appendChild(delCell);

        tableElement.appendChild(row);
    };

    // Populate the table if data was passed in (from the text box)
    for(const {char, freq} of table) {
        addRow(char, freq);
    }

    wrapper.appendChild(tableElement);

    // "Add Row" button for manual mode
    const addBtn = document.createElement("button");
    addBtn.textContent = "+ Add Row";
    addBtn.style.marginTop = "10px";
    addBtn.addEventListener("click", () => {
        addRow("", ""); // Add an empty row
    });
    wrapper.appendChild(addBtn);

    return wrapper;
}