import random
from models import Node, MapGraph
from config import *

def weighted_choice(table):
    return random.choices(
        list(table.keys()),
        weights=table.values()
    )[0]


def generate_map(seed=None) -> MapGraph:
    if seed is not None:
        random.seed(seed)

    nodes = {}
    rows = []
    node_id = 0

    vertical_spacing = (MAP_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN) // (ROWS + 1)

    # START NODE
    start = Node(node_id, "start", MAP_WIDTH // 2, TOP_MARGIN, 0)
    nodes[node_id] = start
    rows.append([start])
    node_id += 1

    # MID ROWS
    for row in range(1, ROWS + 1):
        count = random.randint(MIN_NODES_PER_ROW, MAX_NODES_PER_ROW)
        spacing = (MAP_WIDTH - 2 * SIDE_MARGIN) / max(count - 1, 1)

        row_nodes = []

        for i in range(count):
            x = int(SIDE_MARGIN + i * spacing)

            node = Node(
                node_id,
                weighted_choice(NODE_PROBABILITIES),
                x,
                TOP_MARGIN + row * vertical_spacing,
                row
            )

            nodes[node_id] = node
            row_nodes.append(node)
            node_id += 1

        rows.append(row_nodes)

    # BOSS
    boss = Node(
        node_id,
        "boss",
        MAP_WIDTH // 2,
        MAP_HEIGHT - BOTTOM_MARGIN,
        ROWS + 1
    )

    nodes[node_id] = boss
    rows.append([boss])

    # CONNECTIONS
    for i in range(len(rows) - 1):
        current = rows[i]
        nxt = rows[i + 1]

        for n in nxt:
            parent = random.choice(current)
            if n.id not in parent.connections:
                parent.connections.append(n.id)

        for n in current:
            if not n.connections:
                n.connections.append(random.choice(nxt).id)

    return MapGraph(nodes)