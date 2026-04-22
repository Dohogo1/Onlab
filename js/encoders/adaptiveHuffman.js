class AdaptiveNode {
    constructor(char, weight, order) {
        this.char = char; 
        this.weight = weight;
        this.order = order;
        this.left = null;
        this.right = null;
        this.parent = null;
        this.highlight = null;
    }
    get freq() {
        return this.weight;
    }
    isLeaf() {
        return !this.left && !this.right;
    }
}

export default class AdaptiveHuffman {
    constructor() {
        this.root = new AdaptiveNode("NYT", 0, 512);
        this.nyt = this.root;
        this.nodes = [this.root]; // Keep track of all nodes to easily find max ordered in weight class
        this.seen = new Map();
        
        // History for step-by-step visualization
        this.snapshots = [{
            char: "START",
            code: "",
            fullOutput: "",
            root: this.cloneTree(this.root)
        }];
        this.currentOutput = "";
    }

    encode(text) {
        for (let char of text) {
            this.processChar(char);
        }
    }

    processChar(char) {
        let code = "";
        let currNode;
        this.clearHighlights(this.root);

        // 1. Seen this symbol before?
        if (!this.seen.has(char)) {
            // NO: Get code for NYT, then output raw character
            code = this.getPath(this.nyt) + char;
            this.currentOutput += code;

            // NYT gives birth to new NYT and external nodes
            const oldNyt = this.nyt;
            const newNyt = new AdaptiveNode("NYT", 0, oldNyt.order - 2);
            const newCharNode = new AdaptiveNode(char, 0, oldNyt.order - 1);
            
            oldNyt.char = null; // Becomes internal node
            oldNyt.left = newNyt;
            oldNyt.right = newCharNode;
            newNyt.parent = oldNyt;
            newCharNode.parent = oldNyt;

            // Highlight the brand new nodes
            newCharNode.highlight = "new";
            newNyt.highlight = "new";
            oldNyt.highlight = "split";

            this.nyt = newNyt;
            this.seen.set(char, newCharNode);
            this.nodes.push(newNyt, newCharNode);

            // Increment weight of new leaf and old NYT nodes
            currNode = newCharNode; 
        } else {
            // YES: Go to leaf whose value is this symbol
            currNode = this.seen.get(char);
            code = this.getPath(currNode);
            this.currentOutput += code;
        }

        while (currNode !== null) {
            // Find the highest ordered node in the SAME VITTER BLOCK (same weight AND same type)
            let maxNode = this.findMaxVitterNode(currNode);
            
            // Swap with highest ordered node in block (if it's not itself or its parent)
            if (maxNode !== currNode && currNode.parent !== maxNode) {
                this.swapNodes(currNode, maxNode);
                currNode.highlight = "swap";
                maxNode.highlight = "swap";
            }

            if (!currNode.highlight) {
                currNode.highlight = "weight";
            }

            // Increment Node weight
            currNode.weight += 1;
            
            // Move up to the parent
            currNode = currNode.parent;
        }

        // 3. Collect current weights for the table snapshot
        const currentWeights = [];
        this.seen.forEach((node, char) => {
            currentWeights.push({ 
                char: char, 
                freq: node.weight // Using 'freq' so it matches your table styles
            });
        });
        
        // Optional: Sort so the table stays consistent (e.g., Alphabetical or by Weight)
        currentWeights.sort((a, b) => a.char.localeCompare(b.char));

        // 4. Save state snapshot including the new weights array
        this.snapshots.push({
            char: char,
            code: code,
            fullOutput: this.currentOutput,
            root: this.cloneTree(this.root),
            weights: currentWeights // <--- This is what the controller will read
        });
    }

    findMaxVitterNode(targetNode) {
        let maxNode = null;
        let isTargetLeaf = targetNode.isLeaf();

        for (let n of this.nodes) {
            // Vitter's Rule: Must be same weight AND same type (leaf vs internal)
            if (n.weight === targetNode.weight && n.isLeaf() === isTargetLeaf) {
                if (!maxNode || n.order > maxNode.order) {
                    maxNode = n;
                }
            }
        }
        return maxNode || targetNode; // Fallback to itself if no other nodes in block
    }

    getPath(node) {
        let path = "";
        let curr = node;
        while (curr.parent) {
            path = (curr === curr.parent.left ? "0" : "1") + path;
            curr = curr.parent;
        }
        return path;
    }

    findMaxOrderedInWeightClass(weight) {
        let maxNode = null;
        for (let n of this.nodes) {
            if (n.weight === weight && (!maxNode || n.order > maxNode.order)) {
                maxNode = n;
            }
        }
        return maxNode;
    }

    swapNodes(n1, n2) {
        // Swap orders
        const tempOrder = n1.order;
        n1.order = n2.order;
        n2.order = tempOrder;

        // Swap parents' pointers
        const p1 = n1.parent;
        const p2 = n2.parent;
        const isN1Left = p1.left === n1;
        const isN2Left = p2.left === n2;

        if (isN1Left) p1.left = n2; else p1.right = n2;
        if (isN2Left) p2.left = n1; else p2.right = n1;

        n1.parent = p2;
        n2.parent = p1;
    }

    cloneTree(node) {
        if (!node) return null;
        const clone = Object.assign(new AdaptiveNode(), node);
        clone.left = this.cloneTree(node.left);
        if (clone.left) clone.left.parent = clone;
        clone.right = this.cloneTree(node.right);
        if (clone.right) clone.right.parent = clone;
        return clone;
    }

    clearHighlights(node) {
        if (!node) return;
        node.highlight = null;
        this.clearHighlights(node.left);
        this.clearHighlights(node.right);
    }
}