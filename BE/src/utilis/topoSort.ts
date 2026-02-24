import { Connection, Node } from "../generated/prisma/client";

export function topologicalSort(nodes: Node[], connections: Connection[]) {
  // 1. Get every node dependency Count
  const nodesRegistry: Record<string, Node> = {};
  const nodesChildren: Record<string, string[]> = {};
  const incomingNodesCount: Record<string, number> = {};
  nodes.forEach((node) => {
    nodesChildren[node.id] = [];
    incomingNodesCount[node.id] = 0;
    nodesRegistry[node.id] = node;
  });
  // 2. Get every node dependency
  connections.forEach((connection) => {
    nodesChildren[connection.sourceNodeId].push(connection.targetNodeId);
    incomingNodesCount[connection.targetNodeId] += 1;
  });
  // 3. Create your sorted empty array and a visit Stack
  const sortedArr: Node[] = [];
  const visitStack: Node[] = [];
  // 4. push all zero dependency nodes to your sorted array
  Object.entries(incomingNodesCount).forEach(([nodeId, incomingCount]) => {
    if (incomingCount === 0) {
      sortedArr.push(nodesRegistry[nodeId]);
      visitStack.push(nodesRegistry[nodeId]);
    }
  });
  // 5. Initiate a counter for your nodes that is equal to 0
  let nodesVisited = 0;
  // 6. Loop While the visit stack is not empty
  while (visitStack.length > 0) {
    // 6.1. Pop the last node in your stack
    const currentNode = visitStack.pop()!;
    // 6.2 Increment the nodes by one
    nodesVisited++;

    nodesChildren[currentNode.id].forEach((child) => {
      // 6.3 Decrement the dependency count by one
      incomingNodesCount[child] -= 1;
      // 6.3.1 If the dependency count is 0 then push it your stack
      if (incomingNodesCount[child] === 0) {
        sortedArr.push(nodesRegistry[child]);
        visitStack.push(nodesRegistry[child]);
      }
    });
  }
  // 7. return both sorted and hasCycly boolean where sorted is your sortedArray and hasCycle is a boolean equal to count === nodes.length
  return { sortedArr, hasCycle: nodesVisited !== nodes.length };
}
