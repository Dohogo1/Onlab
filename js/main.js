import * as freqTable from "./freqTable.js";
import { renderTree } from './treeRenderer.js';

let freqTableData = null;
let isTableCreated = false;

document.getElementById("startButton").addEventListener("click", () => {
    const text = document.getElementById("textInput").value;
    freqTableData = freqTable.buildTable(text.toLowerCase());
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

// Example dummy data testing the renderer
const dummyTree = {
    count: 10,
    right: { char: 'a', count: 4 },
    left: { 
        count: 6,
        left: { char: 'b', count: 3 },
        right: { char: 'c', count: 3 }
    }
};

// Call the renderer
renderTree(dummyTree);
