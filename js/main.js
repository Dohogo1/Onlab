import * as freqTable from "./freqTable.js";
import { renderTree } from './treeRenderer.js';
import StaticHuffman from './encoders/staticHuffman.js';

// --- 1. BUILD THE UI CONTROLS ---
const controlsContainer = document.getElementById("controls");

const textInput = document.createElement("input");
textInput.type = "text";
textInput.placeholder = "Enter text here...";
textInput.style.marginRight = "10px";

const enterButton = document.createElement("button");
enterButton.textContent = "Enter";

controlsContainer.appendChild(textInput);
controlsContainer.appendChild(enterButton);

// --- 2. SETUP THE TABLE ---
const ftableContainer = document.getElementById("ftable");

// Initialize an empty table immediately for manual mode
let currentTable = freqTable.createTable([]);
ftableContainer.appendChild(currentTable);
currentTable.addEventListener("input", readTableAndUpdateTrees);

// MODE 1: Text Input Mode
enterButton.addEventListener("click", () => {
    const text = textInput.value;
    const freqTableData = freqTable.buildTable(text.toLowerCase());
    
    // Replace the old table with the newly generated one
    ftableContainer.innerHTML = ""; 
    currentTable = freqTable.createTable(freqTableData);
    ftableContainer.appendChild(currentTable);
    
    // Listen for manual edits on the new table
    currentTable.addEventListener("input", readTableAndUpdateTrees);
    
    // Render the initial trees
    readTableAndUpdateTrees();
});

// MODE 2: Manual Edit Mode (Reading data live from the table)
function readTableAndUpdateTrees() {
    const rows = document.querySelectorAll(".freq-table tr");
    const huffmanInputObj = {};
    let totalProbability = 0; 

    rows.forEach(row => {
        const charInput = row.querySelector(".char-input");
        const freqInput = row.querySelector(".freq-input");
        
        if (charInput && freqInput) {
            const char = charInput.value;
            const freq = parseFloat(freqInput.value);
            
            // Only add to the tree if both a character and a valid frequency exist
            if (char && freq > 0) {
                huffmanInputObj[char] = (huffmanInputObj[char] || 0) + freq;
                totalProbability += freq; 
            }
        }
    });

    const treeWrapper = document.getElementById("tree");

    // 1. Check if the table is completely empty
    if (Object.keys(huffmanInputObj).length === 0) {
        treeWrapper.innerHTML = ""; 
        return;
    }

    // 2. Check if the probabilities add up to exactly 1 (accounting for float math quirks)
    if (Math.abs(totalProbability - 1) > 0.0001) {
        treeWrapper.innerHTML = `<h3 style="color: #d9534f; width: 100%; text-align: center;">
            The sum of all frequencies must equal exactly 1.<br>
            <span style="font-size: 0.8em; color: #555;">Current sum: ${totalProbability.toFixed(4)}</span>
        </h3>`;
        return;
    }

    // 3. If everything is perfect, build the trees!
    const huffman = new StaticHuffman(huffmanInputObj);
    huffman.build();
    renderAllTrees(huffman.solutions, treeWrapper);
}

// Render helper for the layout
function renderAllTrees(solutions, treeWrapper) {
    treeWrapper.innerHTML = ""; 
    treeWrapper.style.display = "flex";
    treeWrapper.style.flexWrap = "wrap";        
    treeWrapper.style.gap = "20px";             
    treeWrapper.style.justifyContent = "center"; 

    if (solutions.length > 0) {
        solutions.forEach((solution, index) => {
            const cardDiv = document.createElement("div");
            cardDiv.style.display = "flex";
            cardDiv.style.flexDirection = "column"; 
            cardDiv.style.alignItems = "center";

            const title = document.createElement("h3");
            title.textContent = `Tree Variation ${index + 1}`;
            title.style.margin = "10px 0";
            cardDiv.appendChild(title);

            const treeDivId = `tree-solution-${index}`;
            const treeDiv = document.createElement("div");
            treeDiv.id = treeDivId;
            cardDiv.appendChild(treeDiv);

            treeWrapper.appendChild(cardDiv);

            renderTree(solution.root, `#${treeDivId}`);
        });
    } else {
        treeWrapper.innerHTML = "<p>Not enough valid data to build a tree.</p>";
    }
}