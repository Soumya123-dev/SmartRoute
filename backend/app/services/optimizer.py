def tsp_nearest_neighbor(matrix):
    """
    Solves the TSP using the Nearest Neighbor heuristic.
    """
    n = len(matrix)
    if n == 0: return [], 0, 0
    
    unvisited = set(range(1, n))
    current = 0
    route = [current]
    total_dist = 0
    total_time = 0
    
    while unvisited:
        next_node = min(unvisited, key=lambda x: matrix[current][x]['distance'])
        route.append(next_node)
        total_dist += matrix[current][next_node]['distance']
        total_time += matrix[current][next_node]['time']
        unvisited.remove(next_node)
        current = next_node
        
    # Optional: return to start
    # total_dist += matrix[current][0]['distance']
    # total_time += matrix[current][0]['time']
    
    return route, total_dist, total_time

def two_opt(route, matrix):
    """
    Improves a given route using the 2-opt algorithm.
    """
    best_route = route
    improved = True
    
    def calculate_total_distance(r):
        dist = 0
        time = 0
        for i in range(len(r) - 1):
            dist += matrix[r[i]][r[i+1]]['distance']
            time += matrix[r[i]][r[i+1]]['time']
        return dist, time

    best_dist, best_time = calculate_total_distance(route)

    while improved:
        improved = False
        for i in range(1, len(route) - 2):
            for j in range(i + 1, len(route)):
                if j - i == 1: continue
                new_route = route[:]
                new_route[i:j] = route[j-1:i-1:-1] # Reverse the segment
                
                new_dist, new_time = calculate_total_distance(new_route)
                if new_dist < best_dist:
                    best_route = new_route
                    best_dist = new_dist
                    best_time = new_time
                    improved = True
        route = best_route
        
    return best_route, best_dist, best_time

def optimize_route(matrix):
    """
    Combines Nearest Neighbor and 2-opt.
    """
    nn_route, nn_dist, nn_time = tsp_nearest_neighbor(matrix)
    optimized_route, opt_dist, opt_time = two_opt(nn_route, matrix)
    return optimized_route, opt_dist, opt_time
