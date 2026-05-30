class BiNode {
    constructor(char, freq) {
        this.char = char;
        this.freq = freq;
        this.left = null;
        this.right = null;
    }
    isLeaf() {
        return !this.left && !this.right;
    }
}
export default class StaticHuffman {
    constructor(table) {
        this.table = table;
        this.solutions = []; // all possible Huffman trees
    }

    build(showAll = true) {
        //create initial forest of BiNodes from the frequency table
        const forest = Object.entries(this.table).map(
            ([char, freq]) => new BiNode(char, freq)
        );

        this.explore(forest,);
        if (!showAll) {
            this.filterUniqueShapes();
        }
    }

    explore(forest) {
        forest = this.cloneForest(forest);

        //stop, if the tree is finished
        if (forest.length === 1) {
            this.solutions.push({
                root: forest[0]
            });
            return;
        }

        // sort by frequency
        forest.sort((a, b) => a.freq - b.freq);

        const freq1 = forest[0].freq;
        const s1Indexes = [];
        
        // find nodes that are tied for the smallest frequency
        for (let i = 0; i < forest.length; i++) {
            // using epsilon for float comparison in case of rounding errors
            if (Math.abs(forest[i].freq - freq1) < 0.00001) {
                s1Indexes.push(i);
            }
        }

        let indexPairs = [];

        if (s1Indexes.length >= 2) {
            // if multiple nodes tied for smallest, pair all possible combinations
            for (let i = 0; i < s1Indexes.length; i++) {
                for (let j = i + 1; j < s1Indexes.length; j++) {
                    indexPairs.push([s1Indexes[i], s1Indexes[j]]);
                }
            }
        } else {
            // second smallest frequency ties
            const freq2 = forest[1].freq;
            const s2Indexes = [];
            
            for (let i = 1; i < forest.length; i++) {
                if (Math.abs(forest[i].freq - freq2) < 0.00001) {
                    s2Indexes.push(i);
                }
            }
            
            // pair the single smallest node with every node tied for second-smallest
            for (let i = 0; i < s2Indexes.length; i++) {
                indexPairs.push([0, s2Indexes[i]]);
            }
        }

        // branch out and explore every valid pair we found
        for (const [idxA, idxB] of indexPairs) {
            const newForest = this.cloneForest(forest);
            
            idxA < idxB ? [idxA, idxB] : [idxB, idxA];

            const nodeA = newForest[idxA];
            const nodeB = newForest[idxB];

            // remove items by index without shifting the array
            newForest.splice(idxB, 1);
            newForest.splice(idxA, 1);

            // create the parent
            let parent;
            if (forest.length === 2){
                // if last parent node, set freq to 1 to avoid rounding issues
                parent = new BiNode(null, 1);
            }
            else {
                parent = new BiNode(null, nodeA.freq + nodeB.freq);
            }
            parent.left = nodeA;
            parent.right = nodeB;

            newForest.push(parent);

            this.explore(newForest);
        }
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

    getTreeShape(node) {
        if (!node) return "";
        
        // If it is a leaf node (no children), just return "L"
        if (!node.left && !node.right) {
            return "L";
        }
        
        // If it is a parent node, wrap its children's shapes in parentheses
        const leftShape = this.getTreeShape(node.left);
        const rightShape = this.getTreeShape(node.right);
        
        return "(" + leftShape + "," + rightShape + ")";
    }

    filterUniqueShapes() {
        const seenShapes = new Set();
        const uniqueSolutions = [];

        for (const solution of this.solutions) {
            const shapeString = this.getTreeShape(solution.root);
            
            if (!seenShapes.has(shapeString)) {
                seenShapes.add(shapeString); // Remember this shape
                uniqueSolutions.push(solution); // Keep the solution
            }
        }

        // Replace the bulky solutions array with our newly filtered one
        this.solutions = uniqueSolutions; 
    }

}