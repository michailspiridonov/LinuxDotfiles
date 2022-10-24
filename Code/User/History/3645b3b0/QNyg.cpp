#ifndef __PROGTEST__
#include <cassert>
#include <iostream>
#include <memory>
#include <limits>
#include <optional>
#include <algorithm>
#include <bitset>
#include <list>
#include <array>
#include <vector>
#include <deque>
#include <set>
#include <map>
#include <unordered_set>
#include <unordered_map>
#include <stack>
#include <queue>

using Place = size_t;

struct Map {
  size_t places;
  Place start, end;
  std::vector<std::pair<Place, Place>> connections;
  std::vector<std::vector<Place>> items;
};

template < typename F, typename S >
struct std::hash<std::pair<F, S>> {
  std::size_t operator () (const std::pair<F, S> &p) const noexcept {
    // something like boost::combine would be much better
    return std::hash<F>()(p.first) ^ (std::hash<S>()(p.second) << 1);
  }
};

#endif

// Basic BFS, returns the shortest path length
size_t findShortestPath(const Map & map) {
  std::queue<Place> q;
  std::unordered_set<Place> visited;
  std::unordered_map<Place, size_t> dist;
  q.push(map.start);
  visited.insert(map.start);
  dist[map.start] = 0;
  while (!q.empty()) {
    Place p = q.front();
    q.pop();
    if( p == map.end ) {
      return dist[p];
    }
    for (auto c : map.connections) {
      if (c.first == p && visited.find(c.second) == visited.end()) {
        q.push(c.second);
        visited.insert(c.second);
        dist[c.second] = dist[p] + 1;
      }
      if (c.second == p && visited.find(c.first) == visited.end()) {
        q.push(c.first);
        visited.insert(c.first);
        dist[c.first] = dist[p] + 1;
      }
    }
  }
  // return infinity if no path found
  return std::numeric_limits<size_t>::max();
}

// BFS with path reconstruction
std::list<Place> find_path(const Map &map) {
  const size_t SHORTEST_PATH_LEN = findShortestPath(map);
  //return empty list if no path found
  if (SHORTEST_PATH_LEN == std::numeric_limits<size_t>::max()) {
    return {};
  }
}

#ifndef __PROGTEST__

using TestCase = std::pair<size_t, Map>;

// Class template argument deduction exists since C++17 :-)
const std::array examples = {
  TestCase{ 1, Map{ 2, 0, 0,
    { { 0, 1 } },
    { { 0 } }
  }},
  TestCase{ 3, Map{ 2, 0, 0,
    { { 0, 1 } },
    { { 1 } }
  }},
  TestCase{ 3, Map{ 4, 0, 1,
    { { 0, 2 }, { 2, 3 }, { 0, 3 }, { 3, 1 } },
    {}
  }},
  TestCase{ 4, Map{ 4, 0, 1,
    { { 0, 2 }, { 2, 3 }, { 0, 3 }, { 3, 1 } },
    { { 2 } }
  }},
  TestCase{ 0, Map{ 4, 0, 1,
    { { 0, 2 }, { 2, 3 }, { 0, 3 }, { 3, 1 } },
    { { 2 }, {} }
  }},
};

int main() {
  int fail = 0;
  for (size_t i = 0; i < examples.size(); i++) {
    auto sol = find_path(examples[i].second);
    if (sol.size() != examples[i].first) {
      std::cout << "Wrong anwer for map " << i << std::endl;
      fail++;
    }
  }

  if (fail) std::cout << "Failed " << fail << " tests" << std::endl;
  else std::cout << "All tests completed" << std::endl;

  return 0;
}

#endif
