import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function renderTree(rootNode, containerSelector = "#tree") {
    // 1. Clear any existing SVG in this specific container

    const container = d3.select(containerSelector);
    container.selectAll("*").remove();

    // 2. Convert your binary node to a D3 Hierarchy FIRST
    // We do this first so we can find out how deep the tree is!
    const root = d3.hierarchy(rootNode, d => {
        const children = [];
        if (d.left) children.push(d.left);
        if (d.right) children.push(d.right);
        return children.length > 0 ? children : null;
    });

    // 3. Calculate Dynamic Dimensions
    const width = root.height > 4 ? 1000 : 600; // Wider for deeper trees
    const margin = { top: 40, right: 0, bottom: 60, left: 0 };
    
    // root.height gives the maximum depth of the tree. 
    // We give each level 70 pixels of breathing room, with a minimum height of 300.
    const levelSpacing = 70; 
    const dynamicHeight = (root.height * levelSpacing) + margin.top + margin.bottom;

    // Append SVG with the new dynamic height
    const svg = container 
        .append("svg")
        .attr("width", width)
        .attr("height", dynamicHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 4. Map the hierarchy to a tree layout using the dynamic height
    const treeLayout = d3.tree().size([
        width - margin.left - margin.right, 
        dynamicHeight - margin.top - margin.bottom
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
        .attr("stroke", d => {
            if (d.data.highlight) return "#f1b84c";
            // Fallback to your original colors if not highlighted
            return !d.children ? "#90fc99" : "lightblue"; 
        }) 
        // Make highlighted nodes slightly thicker
        .attr("stroke-width", d => d.data.highlight ? 5 : 3)
        // Optional: Make the "split" NYT node dashed to show it changing
        .attr("stroke-dasharray", d => {
            if (d.data.highlight === "split") {
                const radius = 20; // Your circle's radius
                const circumference = 2 * Math.PI * radius;
                const numberOfDashes = 10; // You can change this to get more or fewer dashes
                const dashLength = circumference / (numberOfDashes * 2);
                
                return `${dashLength},${dashLength}`;
            }
            return "none";
        });

    node.append("text")
        .attr("dy", "0.31em")
        .attr("text-anchor", "middle")
        .text(d => d.data.freq != null ? formatFreq(d.data.freq) : "")
        .style("font-size", "12px");

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
        .style("fill", "#222")
        .style("font-weight", "bold");

    const orderBadge = node.filter(d => d.data.order !== undefined)
        .append("g")
        .attr("transform", "translate(15, -15)"); // Offset to top right

    // Background rectangle for the badge
    orderBadge.append("rect")
        .attr("width", 22)
        .attr("height", 14)
        .attr("rx", 3) // Rounded corners
        .attr("fill", d => d.data.highlight === "swap" ? "orange" : "#666") // Match swap color
        .attr("x", -11)
        .attr("y", -7);

    // Text for the order number
    orderBadge.append("text")
        .text(d => d.data.order)
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .style("fill", "white")
        .style("font-size", "10px");
}