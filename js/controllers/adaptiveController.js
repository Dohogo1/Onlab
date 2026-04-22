import AdaptiveHuffman from '../encoders/adaptiveHuffman.js';
import { renderTree } from '../treeRenderer.js';

export function initAdaptiveHuffman(container) {
    container.innerHTML = `
        <h1>Adaptive Huffman Coding</h1>
        
        <div class="control-panel" style="background: #f4f4f4; padding: 10px; border-radius: 8px; margin-bottom: 20px; display: flex; gap: 15px; align-items: center;">
            <input type="text" id="init-text" placeholder="Initial string..." style="padding: 5px;">
            <button id="start-btn">Start</button>
            <button id="reset-btn">Reset</button>
            <span style="border-left: 2px solid #ccc; height: 20px;"></span>
            <input type="text" id="append-text" placeholder="Append..." style="padding: 5px; width: 80px;" disabled>
            <button id="append-btn" disabled>Append</button>
        </div>

        <div id="step-controls" style="display: flex; gap: 5px; align-items: center; margin-bottom: 20px; background: #eef; padding: 10px; border-radius: 8px; display: none;">
            <button id="first-btn" style="font-weight: bold; width: 30px;">&lt;&lt;</button>
            <button id="prev-btn" style="font-weight: bold; width: 30px;">&lt;</button>
            <span id="step-counter" style="font-weight: bold; margin: 0 10px;">Step: 0 / 0</span>
            <button id="next-btn" style="font-weight: bold; width: 30px;">&gt;</button>
            <button id="last-btn" style="font-weight: bold; width: 30px;">&gt;&gt;</button>
            <div style="margin-left: 20px;">
                <strong>Char:</strong> <span id="current-char" style="color: blue;">-</span> | 
                <strong>Encoded:</strong> <span id="current-output" style="color: green;">-</span>
            </div>
        </div>

        <div id="ftable-workspace" style="display: flex; gap: 30px; align-items: flex-start;">
            <div id="table-area" style="min-width: 150px;"></div>
            <div id="tree-area" style="flex-grow: 1; display: flex; justify-content: center; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                </div>
        </div>
    `;

    // Elements
    const tableArea = container.querySelector("#table-area");
    const treeArea = container.querySelector("#tree-area");
    const stepCounter = container.querySelector("#step-counter");
    const charDisplay = container.querySelector("#current-char");
    const outputDisplay = container.querySelector("#current-output");

    let encoder = null;
    let currentStep = 0;

    // Helper to render the frequency table for the current step
    const renderTable = (weights) => {
        if (!weights) {
            tableArea.innerHTML = "";
            return;
        }
        let html = '<table class="freq-table"><tr><th>Char</th><th>Weight</th></tr>';
        weights.forEach(item => {
            const displayChar = item.char === " " ? "' ' (Spc)" : item.char;
            html += `<tr><td>${displayChar}</td><td>${item.freq}</td></tr>`;
        });
        html += '</table>';
        tableArea.innerHTML = html;
    };

    const renderStep = () => {
        if (!encoder) return;
        const snap = encoder.snapshots[currentStep];
        
        stepCounter.textContent = `Step: ${currentStep} / ${encoder.snapshots.length - 1}`;
        charDisplay.textContent = snap.char;
        const fullText = container.querySelector("#init-text").value;
        outputDisplay.textContent = currentStep === 0 ? "-" : fullText.substring(0, currentStep);

        container.querySelector("#prev-btn").disabled = currentStep === 0;
        container.querySelector("#next-btn").disabled = currentStep === encoder.snapshots.length - 1;

        renderTable(snap.weights); // Update the table
        renderTree(snap.root, "#tree-area"); // Update the tree
    };

    container.querySelector("#start-btn").addEventListener("click", () => {
        const text = container.querySelector("#init-text").value;
        if (!text) return;
        container.querySelector("#start-btn").disabled = true;
        container.querySelector("#init-text").disabled = true;
        encoder = new AdaptiveHuffman();
        encoder.encode(text);
        currentStep = 0;
        container.querySelector("#step-controls").style.display = "flex";
        container.querySelector("#append-text").disabled = false;
        container.querySelector("#append-btn").disabled = false;
        renderStep();
    });

    container.querySelector("#append-btn").addEventListener("click", () => {
        const text = container.querySelector("#append-text").value;
        if (!text || !encoder) return;
        encoder.encode(text);
        container.querySelector("#append-text").value = "";
        container.querySelector("#init-text").value += text;
        renderStep();
    });

    container.querySelector("#first-btn").addEventListener("click", () => {
        currentStep = 0;
        renderStep();
    });

    container.querySelector("#last-btn").addEventListener("click", () => {
        currentStep = encoder.snapshots.length - 1;
        renderStep();
    });

    container.querySelector("#reset-btn").addEventListener("click", () => {
        // 1. Destroy the current encoder
        encoder = null;
        currentStep = 0;

        // 2. Clear out all the text inputs
        container.querySelector("#init-text").value = "";
        container.querySelector("#append-text").value = "";

        // 3. Reset the UI locks
        container.querySelector("#init-text").disabled = false;
        container.querySelector("#start-btn").disabled = false;
        container.querySelector("#append-text").disabled = true;
        container.querySelector("#append-btn").disabled = true;

        // 4. Hide the controls and clear the output text
        container.querySelector("#step-controls").style.display = "none";
        charDisplay.textContent = "-";
        outputDisplay.textContent = "-";

        // 5. Clear the Table and the Tree
        renderTable(null);
        const svgContainer = d3.select("#tree-area");
        svgContainer.selectAll("*").remove(); 
    });

    container.querySelector("#prev-btn").addEventListener("click", () => { if (currentStep > 0) { currentStep--; renderStep(); } });
    container.querySelector("#next-btn").addEventListener("click", () => { if (currentStep < encoder.snapshots.length - 1) { currentStep++; renderStep(); } });
}