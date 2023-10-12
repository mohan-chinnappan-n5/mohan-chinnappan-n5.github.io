import json
import argparse
from graphviz import Digraph

def convert_har_to_dot(input_har, output_dot):
    # Load the HAR file
    with open(input_har, "r") as har_file:
        har_data = json.load(har_file)

    # Create a new directed graph
    graph = Digraph(format='png')

    # Iterate through HAR entries and add nodes and edges to the graph
    for entry in har_data["log"]["entries"]:
        request = entry["request"]
        response = entry["response"]

        # Extract relevant information from the request and response
        url = request["url"]
        status = response["status"]
        method = request["method"]

        # Create a node for the request
        node_label = f"{method}\n{url}\nStatus: {status}"
        graph.node(url, label=node_label)

        # Connect the request to the host
        graph.edge(url, request["url"].split("/")[2])  # Using the host as the target

    # Save the Graphviz DOT file
    graph.render(output_dot, view=False)
    print(f"DOT file saved at {output_dot}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert HAR file to Graphviz DOT file")
    parser.add_argument("input_har", help="Input HAR file path")
    parser.add_argument("output_dot", help="Output DOT file path")

    args = parser.parse_args()

    convert_har_to_dot(args.input_har, args.output_dot)

