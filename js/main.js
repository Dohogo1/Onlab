import { initStaticHuffman } from './controllers/staticHuffmanController.js';
import { initAdaptiveHuffman } from './controllers/adaptiveController.js';

const appContainer = document.getElementById("app-container");
const algoSelect = document.getElementById("algo-select");

const algorithms = {
    "static-huffman": {
        title: "Static Huffman Coding",
        render: initStaticHuffman
    },
    "adaptive-huffman": {
        title: "Adaptive Huffman (FGK/Vitter)",
        render: initAdaptiveHuffman
    }
};

function switchAlgorithm(algoKey) {
    appContainer.innerHTML = "";

    const algo = algorithms[algoKey];

    if (algo) {
        algo.render(appContainer);
    }
}

algoSelect.addEventListener("change", (e) => {
    switchAlgorithm(e.target.value);
});

switchAlgorithm("static-huffman");