import BiNode from "../biNode.js";

class AdaptiveNode {
    constructor(char, weight, order) {
        this.char = char; 
        this.weight = weight;
        this.order = order;
        this.left = null;
        this.right = null;
        this.parent = null;
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
    
    cloneTree(node) {
        if (!node) return null;
        const clone = Object.assign(new AdaptiveNode(), node);
        clone.left = this.cloneTree(node.left);
        if (clone.left) clone.left.parent = clone;
        clone.right = this.cloneTree(node.right);
        if (clone.right) clone.right.parent = clone;
        return clone;
    }
}