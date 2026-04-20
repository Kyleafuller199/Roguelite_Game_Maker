from map_generator import generate_map
import json
import os


def main():
    graph = generate_map(seed=None)

    # Convert map to JSON
    data = graph.to_dict()

    os.makedirs("output", exist_ok=True)

    with open("output/map.json", "w") as f:
        json.dump(data, f, indent=2)

    print("Map generated successfully.")
    print("Saved to output/map.json")


if __name__ == "__main__":
    main()