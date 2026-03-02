export default class BiNode {
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