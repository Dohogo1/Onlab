import * as freqTable from "./freqTable.js";

let freqTableData = null;
let isTableCreated = false;

document.getElementById("startButton").addEventListener("click", () => {
    const text = document.getElementById("textInput").value;
    const freqTableData = freqTable.buildTable(text.toLowerCase());
    if (isTableCreated) {
        const oldTable = document.querySelector(".freq-table");
        if (oldTable) {
            oldTable.remove();
        }
    }
    document.getElementById("ftable").appendChild(freqTable.createTable(freqTableData));
    isTableCreated = true;
    
    console.log(freqTableData, isTableCreated);
});
