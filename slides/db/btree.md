A B-tree in Python can also be implemented using a class-based approach, similar to a binary tree. Here's a simple implementation of a B-tree in Python:

```python
class BTreeNode:
    def __init__(self, leaf=True):
        self.leaf = leaf
        self.keys = []
        self.child = []

class BTree:
    def __init__(self, t):
        self.root = BTreeNode(True)
        self.t = t  # Minimum degree

    def insert(self, key):
        root = self.root
        if len(root.keys) == (2 * self.t) - 1:
            new_node = BTreeNode()
            new_node.child.insert(0, root)
            self.split_child(new_node, 0)
            self.insert_non_full(new_node, key)
            self.root = new_node
        else:
            self.insert_non_full(root, key)

    def insert_non_full(self, x, key):
        i = len(x.keys) - 1
        if x.leaf:
            x.keys.append(0)
            while i >= 0 and key < x.keys[i]:
                x.keys[i + 1] = x.keys[i]
                i -= 1
            x.keys[i + 1] = key
        else:
            while i >= 0 and key < x.keys[i]:
                i -= 1
            i += 1
            if len(x.child[i].keys) == (2 * self.t) - 1:
                self.split_child(x, i)
                if key > x.keys[i]:
                    i += 1
            self.insert_non_full(x.child[i], key)

    def split_child(self, x, i):
        t = self.t
        y = x.child[i]
        z = BTreeNode(y.leaf)
        x.child.insert(i + 1, z)
        x.keys.insert(i, y.keys[t - 1])
        z.keys = y.keys[t:(2 * t - 1)]
        y.keys = y.keys[0:(t - 1)]
        if not y.leaf:
            z.child = y.child[t:(2 * t)]
            y.child = y.child[0:(t - 1)]

    def search(self, key, x=None):
        if x is not None:
            i = 0
            while i < len(x.keys) and key > x.keys[i]:
                i += 1
            if i < len(x.keys) and key == x.keys[i]:
                return True
            elif x.leaf:
                return False
            else:
                return self.search(key, x.child[i])
        else:
            return self.search(key, self.root)

    def print_tree(self, x=None, l=0):
        if x is not None:
            print("Level", l, ":", len(x.keys), end=" ")
            print("Keys:", x.keys)
            l += 1
            if len(x.child) > 0:
                for child in x.child:
                    self.print_tree(child, l)

# Example usage:
bt = BTree(3)  # B-tree with minimum degree 3

keys = [3, 7, 1, 5, 9, 2, 8, 4, 6]

for key in keys:
    bt.insert(key)

print("B-tree structure:")
bt.print_tree()

search_key = 7
if bt.search(search_key):
    print(f"{search_key} found in the B-tree.")
else:
    print(f"{search_key} not found in the B-tree.")
```

In this implementation:

- `BTreeNode` represents a node in the B-tree, and it can be either a leaf node or an internal node.
- `BTree` is the B-tree class that manages the root node and handles insertion and search operations.
- `insert` is used to insert a key into the B-tree.
- `insert_non_full` is a helper function for inserting into a non-full node.
- `split_child` is a helper function for splitting a child node when necessary.
- `search` is used to search for a key in the B-tree.
- `print_tree` is a utility function to print the structure of the B-tree.

You can modify and extend this basic B-tree implementation to suit your specific needs or add additional functionality as required.
