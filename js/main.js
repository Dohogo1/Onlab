import * as freqTable from "./freqTable.js";
import { renderTree } from './treeRenderer.js';
import StaticHuffman from "./encoders/staticHuffman.js";

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

    // --- Huffman Tree Logic ---
    // 1. StaticHuffman expects an object/dictionary, so we convert the array:
    const huffmanInputObj = {};
    freqTableData.forEach(item => {
        huffmanInputObj[item.char] = item.freq;
    });

    // 2. Instantiate and build the tree
    const huffman = new StaticHuffman(huffmanInputObj);
    huffman.build();

    // 3. Render the first solution found
    if (huffman.solutions.length > 0) {
        const generatedTreeRoot = huffman.solutions[0].root;
        renderTree(generatedTreeRoot);
    } else {
        console.error("No tree solutions were generated.");
    }
});
/*
// Example dummy data testing the renderer
const dummyTree = {
    freq: 1,
    right: { char: 'a', freq: 0.6000 },
    left: { 
        freq: 0.4000,
        left: { char: 'b', freq: 0.12500 },
        right: { char: 'c', freq: 0.275000 }
    }
};

// Call the renderer
renderTree(dummyTree);
*/
