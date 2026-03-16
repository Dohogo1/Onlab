import BiNode from "../biNode.js";

export default class StaticHuffman {

    constructor(table) {
        this.table = table;

        this.solutions = []; // all possible unique Huffman trees
    }

    build() {
        const forest = Object.entries(this.table).map(
            ([char, freq]) => new BiNode(char, freq)
        );

        this.explore(forest, []);
    }

    explore(forest, steps) {

        forest = this.cloneForest(forest);

        // record current state
        const stepRoot = this.createVisualizationRoot(forest);
        const newSteps = [...steps, { root: stepRoot }];

        if (forest.length === 1) {
            this.solutions.push({
                root: forest[0],
                steps: newSteps
            });
            return;
        }

        forest.sort((a, b) => {
            // 1. Sort by frequency first
            if (a.freq !== b.freq) return a.freq - b.freq;
            
            // 2. TIE-BREAKER: If frequencies match, put internal/parent nodes BEFORE leaves
            const aIsLeaf = a.isLeaf() ? 1 : 0;
            const bIsLeaf = b.isLeaf() ? 1 : 0;
            return aIsLeaf - bIsLeaf; 
        });

        const minFreq = forest[0].freq;

        const minNodes = forest.filter(n => n.freq === minFreq);

        let pairs;

        // branching only if >=3 nodes share smallest frequency
        if (minNodes.length >= 3) {
            pairs = this.getCanonicalPairs(minNodes);
        } else {
            pairs = [[forest[0], forest[1]]];
        }

        for (const [a, b] of pairs) {

            const newForest = this.cloneForest(forest);

            const indexA = newForest.findIndex(n => this.sameNode(n, a));
            const indexB = newForest.findIndex(n => this.sameNode(n, b));

            const nodeA = newForest[indexA];
            const nodeB = newForest[indexB];

            newForest.splice(Math.max(indexA, indexB), 1);
            newForest.splice(Math.min(indexA, indexB), 1);

            const parent = new BiNode(null, nodeA.freq + nodeB.freq);
            parent.left = nodeA;
            parent.right = nodeB;

            newForest.push(parent);

            this.explore(newForest, newSteps);
        }
    }

    getCanonicalPairs(nodes) {

        const pairs = [];

        const first = nodes[0];

        for (let i = 1; i < nodes.length; i++) {
            pairs.push([first, nodes[i]]);
        }

        return pairs;
    }

    createVisualizationRoot(forest) {

        if (forest.length === 1) {
            return this.cloneNode(forest[0]);
        }

        return {
            children: forest.map(n => this.cloneNode(n))
        };
    }

    cloneForest(forest) {
        return forest.map(n => this.cloneNode(n));
    }

    cloneNode(node) {

        if (!node) return null;

        const newNode = new BiNode(node.char, node.freq);

        newNode.left = this.cloneNode(node.left);
        newNode.right = this.cloneNode(node.right);

        return newNode;
    }

    sameNode(a, b) {
        return a.char === b.char && a.freq === b.freq;
    }
}
