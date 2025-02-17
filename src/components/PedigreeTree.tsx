import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface PedigreeTreeProps {
  pedigree: string[][];
  riskScores: Map<string, number>;
}
interface NodeData {
  name: string;
  children?: NodeData[];
  risk?: number;
}


const PedigreeTree: React.FC<PedigreeTreeProps> = ({ pedigree, riskScores }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 1400;
    const height = 1000;
    const margin = { top: 50, right: 100, bottom: 50, left: 200 };

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const data: NodeData = { name: "Root", children: [] };
    const nodeMap: Map<string, NodeData> = new Map();
    pedigree.forEach((generation, genIdx) => {
      generation.forEach((dog) => {
        const node = { name: dog, children: [] };
        nodeMap.set(dog, node);

        if (genIdx > 0) {
          pedigree[genIdx - 1].forEach((parent) => {
             // Stelle sicher, dass der Parent existiert
            if (!nodeMap.has(parent)) {
              nodeMap.set(parent, { name: parent, children: [] });
            }

            // Jetzt ist parent sicher in der Map vorhanden
            nodeMap.get(parent)!.children!.push(node);
          });
        }
      });
    });

    data.children = pedigree[0]
  .map((name) => nodeMap.get(name))
  .filter((node): node is NodeData => node !== undefined);

    
    const root: d3.HierarchyNode<NodeData> = d3.hierarchy(data, d => d.children ?? []);
    
    const treeLayout = d3.tree<NodeData>().size([height - 100, width - 300]);
    treeLayout(root);

    // const elbow = (d: d3.HierarchyPointLink<NodeData>) =>
    //   `M${d.source.y},${d.source.x}H${d.target.y}V${d.target.x}`;
    const elbow = (d: d3.HierarchyPointLink<NodeData>) => {
      const sourceX = d.source.x ?? 0; // Falls undefined, auf 0 setzen
      const sourceY = d.source.y ?? 0;
      const targetX = d.target.x ?? 0;
      const targetY = d.target.y ?? 0;
    
      return `M${sourceY},${sourceX}H${targetY}V${targetX}`;
    };
    
    svg.append("g")
      .selectAll("path")
      .data(root.links())
      .enter()
      .append("path")
      .attr("d", (d) => elbow(d as d3.HierarchyPointLink<NodeData>))
      .attr("stroke", "#555")
      .attr("stroke-width", "2px")
      .attr("fill", "none");

    const node = svg.append("g")
      .selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    // Farbabstufung abhängig vom Risikowert (0 = hell, 1 = dunkel)
    const colorScale = d3.scaleLinear<string>()
      .domain([0, 1])
      .range(["#A9D0F5", "#FF0000"]);

    node.append("circle")
      .attr("r", 8)
      .attr("fill", d => colorScale(riskScores.get(d.data.name) || 0));

    // Namen + Risikowert anzeigen
    
      node.append("text")
      .attr("dy", -10).attr("x", function (this, d) {
        const node = d as d3.HierarchyPointNode<NodeData>;
        return node.children ? -40 : 15;
      }).text(function (this, d) {
        const node = d as d3.HierarchyPointNode<NodeData>;
        return node.data.name;
      })
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .attr("text-anchor", function (this, d) {
        const node = d as unknown as d3.HierarchyPointNode<NodeData>;
        return node.children ? "end" : "start";
      });
    node.append("text")
      .attr("dy", 12)
      .attr("x", (d) => (d.children ? -40 : 15))
      .text((d) => `Risiko: ${(riskScores.get((d as d3.HierarchyPointNode<NodeData>).data.name) || 0).toFixed(2)}`)
      .style("font-size", "12px")
      .attr("text-anchor", (d) => (d.children ? "end" : "start"));

  }, [pedigree, riskScores]);

  return <svg ref={svgRef}></svg>;
};

export default PedigreeTree;
