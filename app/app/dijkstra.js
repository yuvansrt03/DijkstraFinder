class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(dis, node) {
    this.queue.push({ dis, node });
    this.sort();
  }

  dequeue() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  sort() {
    this.queue.sort((a, b) => a.weight - b.weight);
  }
}
class Graph {
  constructor() {
    this.vertices = {};
  }

  addVertex(vertex) {
    if (!this.vertices[vertex]) {
      this.vertices[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2, weight) {
    if (!this.vertices[vertex1] || !this.vertices[vertex2]) {
      return;
    }
    const isEdgeExist = this.vertices[vertex1].some(
      (edge) => edge.vertex === vertex2
    );
    if (isEdgeExist) return;
    this.vertices[vertex1].push({ vertex: vertex2, weight });
    this.vertices[vertex2].push({ vertex: vertex1, weight });
  }

  removeEdge(vertex1, vertex2) {
    this.vertices[vertex1] = this.vertices[vertex1].filter(
      (edge) => edge.vertex !== vertex2
    );
    this.vertices[vertex2] = this.vertices[vertex2].filter(
      (edge) => edge.vertex !== vertex1
    );
  }
  removeVertex(vertex) {
    while (this.vertices[vertex].length) {
      const adjVertex = this.vertices[vertex].pop().vertex;
      this.removeEdge(vertex, adjVertex);
    }
  }
  displayGraph() {
    for (const vertex in this.vertices) {
      const edges = this.vertices[vertex].map(
        (edge) => `${edge.vertex}(${edge.weight})`
      );
      console.log(`${vertex} -> ${edges.join(", ")}`);
    }
  }
}
export const dijkstra = async (excluded, start) => {
  return new Promise((resolve, reject) => {
    const dist = new Array(100 + 1).fill(Infinity);
    const parent = new Array(100 + 1).fill(null);
    const myGraph = new Graph();

    for (let i = 1; i <= 100; i++) myGraph.addVertex(i);
    for (let i = 1; i <= 100; i++) {
      myGraph.addEdge(i, i - 10, 1);
      if ((i - 1) % 10 != 0) myGraph.addEdge(i, i - 1, 1);
      myGraph.addEdge(i, i + 10, 1);
      if (i % 10 != 0) myGraph.addEdge(i, i + 1, 1);
    }
    excluded.forEach((item) => {
      myGraph.removeVertex(item);
    });
    const pq = new PriorityQueue();
    dist[start] = 0;
    parent[start] = start;
    pq.enqueue(0, start);

    while (!pq.isEmpty()) {
      const { dis, node } = pq.dequeue();
      for (const item of myGraph.vertices[node]) {
        const edgeWeight = item.weight;
        const adjNode = item.vertex;
        const newDistance = dis + edgeWeight;

        if (newDistance < dist[adjNode]) {
          dist[adjNode] = newDistance;
          pq.enqueue(newDistance, adjNode);
          parent[adjNode] = node;
        }
      }
    }
    resolve({ dist, parent });
  });
};
