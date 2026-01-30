import random
from models import Node, MapGraph
from config import *

def weighted_choice(table):
    return random.choices(list(table.keys()), weights=table.values())[0]

def generate_map(seed=None) -> MapGraph:
    if seed is not None:
        random.seed(seed)

    nodes = {}
    rows = []
    node_id = 0

    vertical_spacing = (MAP_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN) // (ROWS + 1)

    # START NODE
    start = Node(
        id=node_id,
        type="start",
        x=MAP_WIDTH // 2,
        y=TOP_MARGIN,
        row=0
    )
    nodes[node_id] = start
    rows.append([start])
    node_id += 1

    # MID ROWS
    for row in range(1, ROWS + 1):
        count = random.randint(MIN_NODES_PER_ROW, MAX_NODES_PER_ROW)
        spacing = (MAP_WIDTH - 2 * SIDE_MARGIN) / (count - 1) if count > 1 else 0
        xs = [int(SIDE_MARGIN + i * spacing) for i in range(count)]

        row_nodes = []
        for x in xs:
            node = Node(
                id=node_id,
                type=weighted_choice(NODE_PROBABILITIES),
                x=x,
                y=TOP_MARGIN + row * vertical_spacing,
                row=row
            )
            nodes[node_id] = node
            row_nodes.append(node)
            node_id += 1

        rows.append(row_nodes)

    # BOSS NODE
    boss = Node(
        id=node_id,
        type="boss",
        x=MAP_WIDTH // 2,
        y=MAP_HEIGHT - BOTTOM_MARGIN,
        row=ROWS + 1
    )
    nodes[node_id] = boss
    rows.append([boss])

    # CONNECTIONS — guaranteed forward paths
    for i in range(len(rows) - 1):
        current_row = rows[i]
        next_row = rows[i + 1]

        # Step 1: Ensure every next_row node has at least one parent
        for next_node in next_row:
            parent = random.choice(current_row)
            if next_node.id not in parent.connections:
                parent.connections.append(next_node.id)

        # Step 2: Ensure every current node has at least one outgoing connection
        for node in current_row:
            if len(node.connections) == 0 and next_row:
                target = random.choice(next_row)
                node.connections.append(target.id)

        # Step 3: Optional extra branching
        for node in current_row:
            available_targets = [n for n in next_row if n.id not in node.connections]
            if available_targets and random.random() < 0.5:
                target = random.choice(available_targets)
                node.connections.append(target.id)

    return MapGraph(nodes)
