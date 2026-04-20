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
                    "row": getattr(node, "row", None),
                    "connections": node.connections
                }
                for node_id, node in self.nodes.items()
            }
        }