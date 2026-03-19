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

        // Sort by frequency
        forest.sort((a, b) => a.freq - b.freq);

        const freq1 = forest[0].freq;
        const s1Indices = [];
        
        // 1. Find ALL nodes that are tied for the absolute smallest frequency
        for (let i = 0; i < forest.length; i++) {
            // Using a tiny epsilon for float comparison just in case of rounding errors
            if (Math.abs(forest[i].freq - freq1) < 0.00001) {
                s1Indices.push(i);
            }
        }

        let indexPairs = [];

        if (s1Indices.length >= 2) {
            // SCENARIO A: Multiple nodes tied for smallest. Pair all possible combinations of them!
            for (let i = 0; i < s1Indices.length; i++) {
                for (let j = i + 1; j < s1Indices.length; j++) {
                    indexPairs.push([s1Indices[i], s1Indices[j]]);
                }
            }
        } else {
            // SCENARIO B: Only one absolute smallest node. 
            // We MUST pair it with the NEXT smallest node... but we have to check for ties there too!
            const freq2 = forest[1].freq;
            const s2Indices = [];
            
            for (let i = 1; i < forest.length; i++) {
                if (Math.abs(forest[i].freq - freq2) < 0.00001) {
                    s2Indices.push(i);
                }
            }
            
            // Pair the single smallest node (index 0) with EVERY node tied for second-smallest
            for (let i = 0; i < s2Indices.length; i++) {
                indexPairs.push([0, s2Indices[i]]);
            }
        }

        // Branch out and explore every valid pair we found
        for (const [idxA, idxB] of indexPairs) {
            const newForest = this.cloneForest(forest);

            const nodeA = newForest[idxA];
            const nodeB = newForest[idxB];

            // Remove items by index (Larger index first so the array doesn't shift!)
            newForest.splice(Math.max(idxA, idxB), 1);
            newForest.splice(Math.min(idxA, idxB), 1);

            // Create the parent
            const parent = new BiNode(null, nodeA.freq + nodeB.freq);
            parent.left = nodeA;
            parent.right = nodeB;

            newForest.push(parent);

            this.explore(newForest, newSteps);
        }
        
    }
//TODO máshova?
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

    /**
     * Clones a given node of the tree
     * @param {*} node the node to be cloned
     * @returns new node with the same character, frequency and parents
     */
    cloneNode(node) {
        if (!node) return null;

        const newNode = new BiNode(node.char, node.freq);
        newNode.left = this.cloneNode(node.left);
        newNode.right = this.cloneNode(node.right);

        return newNode;
    }
}