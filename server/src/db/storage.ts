import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  geminiApiKey?: string;
  role: 'developer' | 'admin' | 'lead';
  preferences: {
    theme: 'dark' | 'midnight' | 'deep-black';
    editorTheme: string;
    fontSize: number;
    tabSize: number;
    keybinding: 'standard' | 'vim' | 'emacs';
    autoSave: boolean;
  };
  stats: {
    totalProjects: number;
    codingHours: number;
    aiSuggestions: number;
    problemsSolved: number;
    linesOfCode: number;
  };
  createdAt: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isFolder?: boolean;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  language: string;
  files: ProjectFile[];
  activeFileId?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollabRoom {
  roomId: string;
  name: string;
  language: string;
  code: string;
  files: ProjectFile[];
  activeFileId: string;
  hostId: string;
  users: {
    id: string;
    name: string;
    color: string;
    cursor?: { lineNumber: number; column: number };
  }[];
  messages: {
    id: string;
    userId: string;
    userName: string;
    userColor: string;
    text: string;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface DsaProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  acceptanceRate: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    python: string;
    javascript: string;
    typescript: string;
    cpp: string;
    java: string;
  };
  testCases: {
    input: string;
    expected: string;
  }[];
  hints: string[];
}

// In-Memory persistent store for quick, flawless execution without external DB blockages
class MemoryStore {
  users: Map<string, User> = new Map();
  projects: Map<string, Project> = new Map();
  rooms: Map<string, CollabRoom> = new Map();
  dsaProblems: DsaProblem[] = [];

  constructor() {
    this.seedInitialData();
  }

  private async seedInitialData() {
    // Demo user
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('demo123', salt);
    const demoUser: User = {
      id: 'usr_demo_1',
      name: 'Alex Rivera',
      email: 'alex@codebuddy.ai',
      passwordHash: demoPasswordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'developer',
      preferences: {
        theme: 'deep-black',
        editorTheme: 'vs-dark',
        fontSize: 14,
        tabSize: 2,
        keybinding: 'standard',
        autoSave: true,
      },
      stats: {
        totalProjects: 14,
        codingHours: 148,
        aiSuggestions: 382,
        problemsSolved: 46,
        linesOfCode: 12450,
      },
      createdAt: new Date().toISOString(),
    };
    this.users.set(demoUser.id, demoUser);

    // Initial Projects
    const defaultProject: Project = {
      id: 'proj_ai_engine',
      userId: demoUser.id,
      name: 'Smart Search & Vector Engine',
      description: 'Production vector search indexing algorithms and cosine similarity cache',
      language: 'typescript',
      activeFileId: 'f_index',
      files: [
        {
          id: 'f_index',
          name: 'index.ts',
          path: '/index.ts',
          language: 'typescript',
          content: `// CodeBuddy AI - Smart Search & Vector Engine
export interface VectorDocument {
  id: string;
  embedding: number[];
  metadata: Record<string, any>;
}

export class VectorStore {
  private docs: VectorDocument[] = [];

  public add(doc: VectorDocument): void {
    this.docs.push(doc);
  }

  public cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1e-9);
  }

  public query(target: number[], topK: number = 3): { doc: VectorDocument; score: number }[] {
    return this.docs
      .map(doc => ({ doc, score: this.cosineSimilarity(target, doc.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}

// Quick Test execution
const store = new VectorStore();
store.add({ id: '1', embedding: [0.9, 0.1, 0.2], metadata: { title: 'CodeBuddy Core' } });
store.add({ id: '2', embedding: [0.1, 0.8, 0.1], metadata: { title: 'Compiler Engine' } });
console.log("Vector Search Results:", store.query([0.85, 0.15, 0.2], 1));
`,
        },
        {
          id: 'f_utils',
          name: 'mathUtils.ts',
          path: '/mathUtils.ts',
          language: 'typescript',
          content: `export function normalize(vector: number[]): number[] {
  const norm = Math.hypot(...vector);
  return norm === 0 ? vector : vector.map(v => v / norm);
}

export function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((acc, val, i) => acc + Math.pow(val - (b[i] || 0), 2), 0));
}
`,
        },
        {
          id: 'f_readme',
          name: 'README.md',
          path: '/README.md',
          language: 'markdown',
          content: `# Vector Search Engine
High-throughput nearest-neighbor embedding index written in TypeScript.
Run code to execute test query in console.
`,
        }
      ],
      isPublic: true,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(defaultProject.id, defaultProject);

    // Python Project
    const pyProject: Project = {
      id: 'proj_py_algo',
      userId: demoUser.id,
      name: 'Graph Traversal & Dijkstra',
      description: 'Shortest path algorithms with priority queue heap implementation',
      language: 'python',
      activeFileId: 'f_main_py',
      files: [
        {
          id: 'f_main_py',
          name: 'main.py',
          path: '/main.py',
          language: 'python',
          content: `import heapq
from typing import Dict, List, Tuple

def dijkstra(graph: Dict[str, List[Tuple[str, int]]], start: str) -> Dict[str, int]:
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        curr_dist, curr_node = heapq.heappop(pq)
        
        if curr_dist > distances[curr_node]:
            continue
            
        for neighbor, weight in graph.get(curr_node, []):
            dist = curr_dist + weight
            if dist < distances[neighbor]:
                distances[neighbor] = dist
                heapq.heappush(pq, (dist, neighbor))
                
    return distances

# Demo Graph
network = {
    'A': [('B', 4), ('C', 2)],
    'B': [('A', 4), ('C', 1), ('D', 5)],
    'C': [('A', 2), ('B', 1), ('D', 8), ('E', 10)],
    'D': [('B', 5), ('C', 8), ('E', 2)],
    'E': [('C', 10), ('D', 2)]
}

res = dijkstra(network, 'A')
print("Shortest Paths from Node A:")
for node, dist in res.items():
    print(f" -> {node}: {dist} km")
`,
        }
      ],
      isPublic: false,
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(pyProject.id, pyProject);

    // Initial DSA Problems Library
    this.dsaProblems = [
      {
        id: 'dsa_1',
        title: 'Two Sum',
        slug: 'two-sum',
        difficulty: 'Easy',
        category: 'Arrays & Hashing',
        acceptanceRate: '54.2%',
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
        examples: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
          },
          {
            input: 'nums = [3,2,4], target = 6',
            output: '[1,2]',
          },
        ],
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
          'Only one valid answer exists.',
        ],
        starterCode: {
          python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your optimal O(n) solution here
        pass
`,
          javascript: `function twoSum(nums, target) {
  // Use a hash map for O(n) lookup
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
console.log(twoSum([2, 7, 11, 15], 9));
`,
          typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}
console.log(twoSum([2, 7, 11, 15], 9));
`,
          cpp: `#include <vector>
#include <unordered_map>
#include <iostream>

using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int comp = target - nums[i];
            if (seen.count(comp)) {
                return {seen[comp], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    Solution s;
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = s.twoSum(nums, 9);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}
`,
          java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                return new int[]{map.get(comp), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
    
    public static void main(String[] args) {
        Solution s = new Solution();
        int[] res = s.twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(Arrays.toString(res));
    }
}
`,
        },
        testCases: [
          { input: '[2,7,11,15], target = 9', expected: '[0, 1]' },
          { input: '[3,2,4], target = 6', expected: '[1, 2]' },
          { input: '[3,3], target = 6', expected: '[0, 1]' },
        ],
        hints: [
          'A brute force approach tests all pairs in O(n^2). Can you do it in single pass O(n)?',
          'Use a hash table to check if the complement (target - current_val) was already seen in O(1) time.',
        ],
      },
      {
        id: 'dsa_2',
        title: 'LRU Cache',
        slug: 'lru-cache',
        difficulty: 'Medium',
        category: 'Linked List & Design',
        acceptanceRate: '43.1%',
        description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\`: Initialize the LRU cache with positive size capacity.
- \`int get(int key)\`: Return the value of the key if it exists, otherwise return -1.
- \`void put(int key, int value)\`: Update the value of the key if key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity, evict the least recently used key.

The functions \`get\` and \`put\` must each run in O(1) average time complexity.`,
        examples: [
          {
            input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
            output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
          },
        ],
        constraints: [
          '1 <= capacity <= 3000',
          '0 <= key <= 10^4',
          '0 <= value <= 10^5',
          'At most 2 * 10^5 calls will be made to get and put.',
        ],
        starterCode: {
          python: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        # Hash map + Doubly Linked List

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass
`,
          javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      // Map keys iterator yields in insertion order
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }
}

const lru = new LRUCache(2);
lru.put(1, 1);
lru.put(2, 2);
console.log("get(1):", lru.get(1)); // 1
lru.put(3, 3); // evicts key 2
console.log("get(2):", lru.get(2)); // -1
`,
          typescript: `class LRUCache {
  private capacity: number;
  private map: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }
}
`,
          cpp: `#include <unordered_map>
#include <list>
#include <iostream>

using namespace std;

class LRUCache {
    int cap;
    list<pair<int, int>> dll;
    unordered_map<int, list<pair<int, int>>::iterator> cache;
public:
    LRUCache(int capacity) : cap(capacity) {}
    
    int get(int key) {
        if (!cache.count(key)) return -1;
        dll.splice(dll.begin(), dll, cache[key]);
        return cache[key]->second;
    }
    
    void put(int key, int value) {
        if (cache.count(key)) {
            dll.splice(dll.begin(), dll, cache[key]);
            cache[key]->second = value;
            return;
        }
        if (dll.size() == cap) {
            int oldKey = dll.back().first;
            dll.pop_back();
            cache.erase(oldKey);
        }
        dll.emplace_front(key, value);
        cache[key] = dll.begin();
    }
};
`,
          java: `import java.util.*;

class LRUCache {
    private final int capacity;
    private final LinkedHashMap<Integer, Integer> map;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new LinkedHashMap<>(capacity, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
                return size() > LRUCache.this.capacity;
            }
        };
    }
    
    public int get(int key) {
        return map.getOrDefault(key, -1);
    }
    
    public void put(int key, int value) {
        map.put(key, value);
    }
}
`,
        },
        testCases: [
          { input: 'put(1,1), put(2,2), get(1)', expected: '1' },
          { input: 'put(3,3), get(2)', expected: '-1' },
        ],
        hints: [
          'Which data structure offers O(1) lookup? A hash map.',
          'Which data structure offers O(1) removal and insertion at arbitrary ends? A doubly linked list.',
        ],
      },
      {
        id: 'dsa_3',
        title: 'Trapping Rain Water',
        slug: 'trapping-rain-water',
        difficulty: 'Hard',
        category: 'Two Pointers & Monotonic Stack',
        acceptanceRate: '61.4%',
        description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
        examples: [
          {
            input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
            output: '6',
            explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.',
          },
        ],
        constraints: [
          'n == height.length',
          '1 <= n <= 2 * 10^4',
          '0 <= height[i] <= 10^5',
        ],
        starterCode: {
          python: `class Solution:
    def trap(self, height: list[int]) -> int:
        # Two pointer approach in O(n) time and O(1) extra space
        pass
`,
          javascript: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let totalWater = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        totalWater += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        totalWater += rightMax - height[right];
      }
      right--;
    }
  }
  return totalWater;
}
console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6
`,
          typescript: `function trap(height: number[]): number {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let totalWater = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else totalWater += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else totalWater += rightMax - height[right];
      right--;
    }
  }
  return totalWater;
}
`,
          cpp: `#include <vector>
#include <iostream>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = height.size() - 1;
        int lMax = 0, rMax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                if (height[l] >= lMax) lMax = height[l];
                else water += lMax - height[l];
                l++;
            } else {
                if (height[r] >= rMax) rMax = height[r];
                else water += rMax - height[r];
                r--;
            }
        }
        return water;
    }
};
`,
          java: `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1;
        int lMax = 0, rMax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                if (height[l] >= lMax) lMax = height[l];
                else water += lMax - height[l];
                l++;
            } else {
                if (height[r] >= rMax) rMax = height[r];
                else water += rMax - height[r];
                r--;
            }
        }
        return water;
    }
}
`,
        },
        testCases: [
          { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expected: '6' },
          { input: '[4,2,0,3,2,5]', expected: '9' },
        ],
        hints: [
          'For each index i, how much water can be stored above it? It is min(max_left, max_right) - height[i].',
          'Use two pointers starting at opposite ends to track the lower wall dynamically in O(1) space.',
        ],
      },
    ];

    // Seed a Collab Room
    const demoRoom: CollabRoom = {
      roomId: 'ROOM42',
      name: 'Distributed Systems Pair Session',
      language: 'typescript',
      code: `// Collaborative Coding Room: Distributed Consensus Algorithm
// Feel free to type in real time! Changes sync across all connected users.

export interface LogEntry {
  term: number;
  command: string;
}

export class RaftNode {
  currentTerm: number = 0;
  votedFor: string | null = null;
  log: LogEntry[] = [];
  
  constructor(public readonly nodeId: string) {}

  requestVote(candidateId: string, candidateTerm: number): boolean {
    if (candidateTerm > this.currentTerm) {
      this.currentTerm = candidateTerm;
      this.votedFor = candidateId;
      return true;
    }
    return false;
  }
}

const node1 = new RaftNode("node-east-1");
console.log("Raft node initialized:", node1.nodeId);
`,
      activeFileId: 'f_raft',
      files: [
        {
          id: 'f_raft',
          name: 'raft.ts',
          path: '/raft.ts',
          language: 'typescript',
          content: `// Raft node implementation\nconsole.log("Collaborative session active.");`,
        }
      ],
      hostId: demoUser.id,
      users: [
        { id: demoUser.id, name: demoUser.name, color: '#8B5CF6' }
      ],
      messages: [
        {
          id: 'm1',
          userId: demoUser.id,
          userName: demoUser.name,
          userColor: '#8B5CF6',
          text: 'Welcome to CodeBuddy Live Collab! You can edit code together, run it, and chat in real-time.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ],
      createdAt: new Date().toISOString(),
    };
    this.rooms.set(demoRoom.roomId, demoRoom);
  }
}

export const db = new MemoryStore();
