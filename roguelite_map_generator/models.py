from dataclasses import dataclass, field
from typing import List, Dict
import math

@dataclass
class Node:
    id: int
    type: str
    x: int
    y: int
    row: int
    connections: List[int] = field(default_factory=list)

    def is_clicked(self, mx, my, radius):
        return math.hypot(self.x - mx, self.y - my) <= radius

@dataclass
class MapGraph:
    nodes: Dict[int, Node]
