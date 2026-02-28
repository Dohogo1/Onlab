import { buildTable } from "./freqTable.js";
document.getElementById("startButton").addEventListener("click", () => {
    const text = document.getElementById("textInput").value;
    const freqTable = buildTable(text.toLowerCase());
    console.log(freqTable);
});
