import * as freqTable from "../freqTable.js";
import StaticHuffman from '../encoders/staticHuffman.js';
import { renderTree } from '../treeRenderer.js';

export function initStaticHuffman(container) {
    container.innerHTML = `
        <h1>Static Huffman Coding</h1>
        <div id="controls" style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <input type="text" id="text-input" placeholder="Enter text...">
            <button id="enter-button">Generate</button>
            <input type="checkbox" id="show-all-trees"> <label>Show All Variations</label>
        </div>
        <div id="ftable-workspace" style="display: flex; gap: 20px; flex-wrap: wrap; align-items: flex-start;">
            <div id="table-area"></div>
            <div id="tree-area" style="flex-grow: 1; display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;"></div>
        </div>
    `;

    const textInput = container.querySelector("#text-input");
    const enterBtn = container.querySelector("#enter-button");
    const showAll = container.querySelector("#show-all-trees");
    const tableArea = container.querySelector("#table-area");
    const treeArea = container.querySelector("#tree-area");

    let currentTable = freqTable.createTable([]);
    tableArea.appendChild(currentTable);

    const update = () => {
        const rows = container.querySelectorAll(".freq-table tr");
        const huffmanInputObj = {};
        let totalProb = 0;

        rows.forEach(row => {
            const charIn = row.querySelector(".char-input");
            const freqIn = row.querySelector(".freq-input");
            if (charIn && freqIn && charIn.value && parseFloat(freqIn.value) > 0) {
                huffmanInputObj[charIn.value] = parseFloat(freqIn.value);
                totalProb += parseFloat(freqIn.value);
            }
        });

        if (Math.abs(totalProb - 1) > 0.00001) {
            treeArea.innerHTML = `<p style="color:red">Frequencies must sum to 1 (Current: ${totalProb.toFixed(4)})</p>`;
            return;
        }

        const huffman = new StaticHuffman(huffmanInputObj);
        huffman.build(showAll.checked);
        
        treeArea.innerHTML = "";
        huffman.solutions.forEach((sol, i) => {
            const div = document.createElement("div");
            div.id = `tree-sol-${i}`;
            
            // FIX: Add styling to each solution container to prevent overlap
            div.style.flex = "0 1 auto"; 
            div.style.textAlign = "center";
            div.style.padding = "10px";
            div.style.border = "1px solid #eee";
            div.style.borderRadius = "8px";

            treeArea.appendChild(div);
            renderTree(sol.root, `#${div.id}`);
        });
    };

    enterBtn.addEventListener("click", () => {
        const data = freqTable.buildTable(textInput.value.toLowerCase());
        tableArea.innerHTML = "";
        currentTable = freqTable.createTable(data);
        tableArea.appendChild(currentTable);
        currentTable.addEventListener("input", update);
        update();
    });

    currentTable.addEventListener("input", update);
    showAll.addEventListener("change", update);
}