import { initStaticHuffman } from './controllers/staticHuffmanController.js';

const appContainer = document.getElementById("app-container");
const algoSelect = document.getElementById("algo-select");

const algorithms = {
    "static-huffman": {
        title: "Static Huffman Coding",
        render: initStaticHuffman
    },
    "adaptive-huffman": {
        title: "Adaptive Huffman (FGK/Vitter)",
        render: (container) => {
            container.innerHTML = `<h2>${algorithms["adaptive-huffman"].title}</h2>
                                <p>Adaptive Huffman logic goes here...</p>`;
        }
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