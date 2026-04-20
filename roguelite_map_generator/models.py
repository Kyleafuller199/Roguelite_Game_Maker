class Node:
    def __init__(self, id, type, x, y, row=None):
        self.id = id
        self.type = type
        self.x = x
        self.y = y
        self.row = row
        self.connections = []


class MapGraph:
    def __init__(self, nodes):
        self.nodes = nodes

    def to_dict(self):
        return {
            "nodes": {
                node_id: {
                    "id": node.id,
                    "type": node.type,
                    "x": node.x,
                    "y": node.y,
                    "row": node.row,
                    "connections": node.connections
                }
                for node_id, node in self.nodes.items()
            }
        }