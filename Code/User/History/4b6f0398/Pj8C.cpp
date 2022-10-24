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

// BFS with path reconstruction
std::list<Place> find_path(const Map &map) {
  std::list<Place> path;
  // list of all paths to the end
  std::vector<std::list<Place>> paths;
  std::queue<Place> q;
  std::unordered_map<Place, Place> prev;
  std::unordered_set<Place> visited;
  // list of collected items
  std::vector<bool> collected(map.items.size(), false);
  // BFS
  q.push(map.start);
  visited.insert(map.start);
  while (!q.empty()) {
    Place current = q.front();
    q.pop();
    // check if the current place contains an item
    for (size_t i = 0; i < map.items.size(); ++i) {
      if (std::find(map.items[i].begin(), map.items[i].end(), current) != map.items[i].end()) {
        collected[i] = true;
      }
    }
    // check if the current place is the end and all items are collected
    if (current == map.end && std::all_of(collected.begin(), collected.end(), [](bool b) { return b; })) {
      // reconstruct the path and return it
      path.push_front(current);
      while (current != map.start) {
        current = prev[current];
        path.push_front(current);
      }
      return path;
    }
    // Iterate over all connections
    for (auto &connection : map.connections) {
      if (connection.first == current) {
        // check that the neighbor is not visited
        if (visited.find(connection.second) == visited.end()) {
          q.push(connection.second);
          visited.insert(connection.second);
          prev[connection.second] = current;
        }
      }
    }

  }
  //return empty path if no path was found
  return path;
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
