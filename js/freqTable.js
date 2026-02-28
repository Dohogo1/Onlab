export function buildTable(text) {
    const table = {};
    for (const char of text) {
        table[char] = (table[char] || 0) + 1;
    }
    for (const char in table) {
        table[char] /= text.length;
    }
    return table;
}