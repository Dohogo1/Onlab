import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function renderTree(rootNode, containerSelector = "#tree") {
    // 1. Clear any existing SVG in this specific container
    const container = d3.select(containerSelector);
    container.selectAll("*").remove();

    // 2. Set up dimensions
    const width = 450;
    const height = 300;
    const margin = { top: 40, right: 0, bottom: 40, left: 0 };

    // Append to the passed container instead of hardcoded #tree
    const svg = container 
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 3. Convert your binary node to a D3 Hierarchy
    const root = d3.hierarchy(rootNode, d => {
        const children = [];
        if (d.left) children.push(d.left);
        if (d.right) children.push(d.right);
        return children.length > 0 ? children : null;
    });

    // Sort the tree so the smaller frequencies always go to the left
    //root.sort((a, b) => b.data.freq - a.data.freq);


    // 4. Map the hierarchy to a tree layout
    const treeLayout = d3.tree().size([
        width - margin.left - margin.right, 
        height - margin.top - margin.bottom
    ]);
    treeLayout(root);

    // 5. Draw the lines (Links)
    svg.selectAll(".link")
        .data(root.links())
        .join("path")
        .attr("class", "link")
        .attr("d", d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        )
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2);

    // 5.5 Draw the Edge Labels (0 or 1)
    svg.selectAll(".link-label")
        .data(root.links())
        .join("text")
        .attr("class", "link-label")
        // Calculate the midpoint between the parent (source) and child (target)
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2)
        .attr("dy", "-5px") // Nudge it up slightly so it doesn't cross the line
        .attr("text-anchor", "middle")
        .text(d => {
            // Check if this child is the left or right node of its parent
            if (d.source.data.left === d.target.data) {
                return "0";
            } else if (d.source.data.right === d.target.data) {
                return "1";
            }
            return "";
        })
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#666");

    const formatFreq = d3.format(".4~f");

    // 6. Draw the nodes (Circles + Text)
    const node = svg.selectAll(".node")
        .data(root.descendants())
        .join("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    // Add circles
    node.append("circle")
        .attr("r", 20)
        .attr("fill", "#fff")
        // Check for children: if none (!d.children), it's a leaf! Make it green.
        .attr("stroke", d => !d.children ? "#90fc99" : "lightblue") 
        .attr("stroke-width", 3);

    node.append("text")
        .attr("dy", "0.31em")
        .attr("text-anchor", "middle")
        .text(d => d.data.freq != null ? formatFreq(d.data.freq) : "")
        .style("font-size", "12px")
        .style("font-weight", "bold");

    // Add text 
    node.filter(d => !d.children) // Only target leaves
        .append("text")
        .attr("dy", "2.8em") // Push it below the circle
        .attr("text-anchor", "middle")
        .text(d => {
            if (d.data.char === " ") return "' ' (Spc)";
            if (d.data.char === "\n") return "'\\n'";
            return `${d.data.char}`; // Wrap the character in quotes for clarity
        })
        .style("font-size", "13px")
        .style("fill", "#222");
}